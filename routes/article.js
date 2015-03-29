var express  = require('express')
	, router   = express.Router()
	, Article  = require('../models/redis/Article').Article
	, category = require('../config/webfront/categories2')
	, mongoConfig = require('../config/mongo')
	, authMiddlewares = require('./middlewares/auth')
	, webFrontIndexConfig = require('../config/webfront/index')
	, articleRoutesBehaviors = require('./articleRoutesBehaviors')
	, getArticlesViaCache = require('./behaviors/getArticlesViaCache')
	, tokenBasedAuthenticationMiddlewares = require('./middlewares/tokenBasedAuthentication')
	, adminCachingBehaviors = require('./behaviors/adminCache')
	, categoryCachingBehaviors = require('./behaviors/categoryCache');





router.get('/create', authMiddlewares.isLoggedIn, function (req, res) {
	articleRoutesBehaviors.get.create.v1(req, res);
});

router.post('/create', authMiddlewares.isLoggedIn, function (req, res) {
	articleRoutesBehaviors.post.create.v2(req, res);
});
 
router.get('/my-articles', tokenBasedAuthenticationMiddlewares.canEditDeleteArticle, function (req, res) {
	articleRoutesBehaviors.get.myArticles.v2(req, res);
});

router.get('/my-articles/more/:number', tokenBasedAuthenticationMiddlewares.canEditDeleteArticle, function (req, res) {
	articleRoutesBehaviors.get.myArticlesMore.v2(req, res);
});

router.get('/random/:number?', function (req, res) {
	var number = req.params.number || 5;
	Article.getRandomArticles(number, function (err, articles) {
		res.json(articles);
	});
});

router.get('/edit/:articleId', tokenBasedAuthenticationMiddlewares.canEditDeleteArticle, function (req, res) {
	articleRoutesBehaviors.get.edit.v1(req, res);
});

router.get('/json/latest/:category/:number', function (req, res) {
	getArticlesViaCache.getCachedLatestArticles({
		number : req.params.number,
		category : req.params.category
	}, function (err,response) {
		if (err) {
			return res.json({ status : 'error' });
		}
		res.json({
			status : 'ok',
			data : response
		});
	});
});

router.get('/json/:articleId', function (req, res) {
	getArticlesViaCache.getCachedArticle({
		articleId : req.params.articleId
	}, function (err, response) {

		if (err) {
			return res.json({ status : 'error' });
		}
		res.json({
			status : 'ok',
			data : response
		});
	});
});

router.get('/:articleId/:title?', function (req, res) {
	articleRoutesBehaviors.get.getArticleById.v2(req, res);
});

router.post('/edit/:title?', tokenBasedAuthenticationMiddlewares.canEditDeleteArticle, function (req, res) {
	articleRoutesBehaviors.post.edit.v1(req, res, function (err, args, callback) {

		if (err) {
			return callback(err);
		}
		if (!args
			|| !args.article) {
			return callback('No args');
		}

		var t1 = function (done) {

			adminCachingBehaviors.removeCachedArticles({
				articleId : args.article.articleId,
				category  : args.article.oldCategory
			}, function (err) {
				done();
			});

		}

		var t2 = function (done) {

			adminCachingBehaviors.cacheCrawledArticle(null, args, function () {

				done();

			});

		}

		var t3 = function (done) {

			categoryCachingBehaviors.updateCategoryCache(null, function () {
				done();
			});

		}

		async.series([t1, t2, t3], function (err, results) {

			callback(null);

		});


	});
});

router.post('/delete', tokenBasedAuthenticationMiddlewares.canEditDeleteArticle, function (req, res) {
	articleRoutesBehaviors.post.delete.v2(req, res, function (err, callback) {

		if (err) {
			callback(err);
		}

		var t1 = function (done) {

			adminCachingBehaviors.removeCachedArticles({
				articleId : req.body.articleId,
				category  : req.body.articleCategory
			}, function () {
				done();
			});
			
		}

		var t2 = function (done) {
			categoryCachingBehaviors.updateCategoryCache(null, function () {
				done();
			});
		}

		async.series([t1, t2], function (err, results) {
			return callback(null);
		});

	});
});


module.exports = router;