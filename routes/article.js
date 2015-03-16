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
	, adminCachingBehaviors = require('./behaviors/adminCache');



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

router.get('/edit/:articleId', authMiddlewares.isLoggedIn, authMiddlewares.doesArticleBelongToMongoUser, function (req, res) {
	articleRoutesBehaviors.get.edit.v1(req, res);
});

router.get('/json/latest/:category/:number', function (req, res) {
	getArticlesViaCache.getCachedLatestArticles({
		number : req.params.number,
		category : null
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

router.post('/edit/:title?', authMiddlewares.isLoggedIn, function (req, res) {
	articleRoutesBehaviors.post.edit.v1(req, res);
});

router.post('/delete', tokenBasedAuthenticationMiddlewares.canEditDeleteArticle, function (req, res) {
	articleRoutesBehaviors.post.delete.v2(req, res, function (err, callback) {

		if (err) {
			callback(err);
		}

		adminCachingBehaviors.removeCachedArticles({
			articleId : req.body.articleId,
			category  : req.body.articleCategory
		}, callback);

	});
});


module.exports = router;