var express = require('express');
var router = express.Router();
var Article = require('../models/redis/Article').Article;
var authMiddlewares = require('./middlewares/auth');
var tokenBasedAuthenticationMiddlewares = require('./middlewares/tokenBasedAuthentication');
var CrawledArticleModel = require('../models/mongo/CrawledArticle');
var articleRoutesBehaviors = require('./articleRoutesBehaviors');
var Imgur = new require('../plugins/imgur/imgur');
var imgur = new Imgur({
	clientId : 'fe831b31baf537f'
});
var articleCacher = new require('../plugins/articleCacher');
var async = require('async');
var dummy = require('./middlewares/dummy');
var adminCachingBehaviors = require('./behaviors/adminCache');
var categoryCachingBehaviors = require('./behaviors/categoryCache');
var uploadImagesToImgur = require('./behaviors/uploadImagesToImgur');
var fs = require('fs');


router.get('/pending-confirmation-articles', authMiddlewares.isLoggedIn, authMiddlewares.isAdmin, function (req, res) {
	Article.getAllPendingConfirmationArticles(0, 20, function (articles) {
		res.render('admin/pending-confirmation-articles', { articles : articles, message : req.flash('message') });
	});
});

router.post('/confirm-article', authMiddlewares.isLoggedIn, authMiddlewares.isAdmin, function (req, res) {
	Article.confirmArticle(req.body.articleId, function (err) {
		if (err) {
			req.flash('message', err);
		} else {
			req.flash('message', 'Article has been confirmed');
		}
		res.redirect('/admin/pending-confirmation-articles');
	});
});

router.get('/list-crawled-articles', tokenBasedAuthenticationMiddlewares.canApproveCrawledArticle, function (req, res) {

	CrawledArticleModel
		.find()
		.sort({ created : -1 })
		.select({ title : 1, _id : 1 })
		.exec(function (err, crawledArticles) {
			if (err) {
				return res.status(500).send("Something's wrong");
			}
			res.render('admin/list-crawled-articles', { crawledArticles : crawledArticles });
		});

});

router.get('/list-crawled-article/:id', tokenBasedAuthenticationMiddlewares.canApproveCrawledArticle, function (req, res) {

	CrawledArticleModel
		.find()
		.where({ _id : req.params.id })
		.exec(function (err, crawledArticle) {
			crawledArticle = crawledArticle[0];

			if (crawledArticle) {
				req.body.title = crawledArticle.title;
				req.body.thumbnail = crawledArticle.thumbnail;
				req.body.content = crawledArticle.content;
				req.body.images = crawledArticle.images;
				req.body.category = crawledArticle.category;
				req.body.id = crawledArticle._id;
			}

			uploadImagesToImgur.uploadImagesOfCrawledArticle({
				thumbnail : req.body.thumbnail,
				images : req.body.images,
				content : req.body.content
			}, function (err, response) {
				if (err) {
					return console.log(err);
				}

				req.body.thumbnail = response.thumbnail;
				req.body.images = response.images;
				req.body.content = response.content;
				articleRoutesBehaviors.get.create.v1(req, res);
			});

		});



});

router.post('/list-crawled-article/:id', tokenBasedAuthenticationMiddlewares.canApproveCrawledArticle, dummy.randomizeUserName, dummy.createArticleId, function (req, res) {
	

	articleRoutesBehaviors.post.create.v2(req, res, function (err, args, callback) {

		if (err) {
			return callback(err);
		}

		if (!args
			|| !args.article) {
			console.log('No args');
			return callback('No "args"');
		}

		var t1 = function (done) {

			CrawledArticleModel
				.where({ _id : req.body.id })
				.findOneAndRemove(function () {
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

		async.parallel([t1, t2, t3], function (err, results) {

			callback(null);

		});


	});
});

router.get('/control-panel', function (req, res) {

	res.render('admin/control-panel', { title : 'Super Admin' });

});

router.post('/update-category-cache', tokenBasedAuthenticationMiddlewares.canAccessControlPanel, function (req, res) {

	categoryCachingBehaviors.updateCategoryCache(null, function () {
		res.json({
			status : 'Success'
		});
	});

});

router.post('/trim-cached-articles-in-pool', tokenBasedAuthenticationMiddlewares.canAccessControlPanel, function (req, res) {

	articleCacher.trimCachedArticlesInPool({
		key : req.body.key,
		trimSize : req.body.size
	}, function (err, response) {
		if (err) {
			res.json({
				status : err
			});
		} else {
			res.json({
				status : 'Success'
			});
		}
	});

});

module.exports = router;