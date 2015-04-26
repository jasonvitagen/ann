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

var jwt = require('jsonwebtoken');
var secret = require('../config/auth');

var conzh = require('../plugins/conzh');
var timeout = require('connect-timeout');

var willPostToRemoveServerMiddleware = require('./middlewares/willPostToRemoteServer').willPostToServer;

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

router.get('/list-crawled-articles-json', tokenBasedAuthenticationMiddlewares.canApproveCrawledArticle, function (req, res) {

	CrawledArticleModel
		.find()
		.where({ state : 'new' })
		.sort({ created : -1 })
		.select({ title : 1, _id : 1, category : 1 })
		.exec(function (err, crawledArticles) {
			if (err) {
				return res.json({
					status : err
				});
			}
			res.json({
				status : 'success',
				data : crawledArticles
			});
		});

});

router.get('/list-archived-crawled-articles-json', tokenBasedAuthenticationMiddlewares.canApproveCrawledArticle, function (req, res) {

	CrawledArticleModel
		.find()
		.where({ state : 'approved' })
		.sort({ created : -1 })
		.select({ title : 1, _id : 1, category : 1 })
		.exec(function (err, crawledArticles) {
			if (err) {
				return res.json({
					status : err
				});
			}
			res.json({
				status : 'success',
				data : crawledArticles
			});
		});

});

router.get('/list-crawled-article/:id', timeout('40s'), tokenBasedAuthenticationMiddlewares.canApproveCrawledArticle, function (req, res) {

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

			try {


				uploadImagesToImgur.uploadImagesOfCrawledArticle({
					thumbnail : req.body.thumbnail,
					images : req.body.images,
					content : req.body.content
				}, function (err, response) {
					console.log(response);
					if (err) {
						return console.log(err);
					}

					req.body.thumbnail = response.thumbnail;
					req.body.images = response.images;
					req.body.content = response.content;
					articleRoutesBehaviors.get.create.v1(req, res);
				});

			} catch (err) {
				console.log(err);
			}			

		});



});

router.post('/list-crawled-article/:id', willPostToRemoveServerMiddleware, tokenBasedAuthenticationMiddlewares.canApproveCrawledArticle, dummy.randomizeUserName, dummy.createArticleId, function (req, res) {

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

			args.article.title = conzh(args.article.title);
			args.article.content = conzh(args.article.content);
			done();

		}

		var t2 = function (done) {

			CrawledArticleModel.findById(req.params.id, function (err, article) {

				if (err) {
					return done(err);
				}

				article.state = 'approved';

				article.save(function (err) {
					if (err) {
						return done(err);
					}
					done();
				});

			});

		}

		var t3 = function (done) {

			adminCachingBehaviors.cacheCrawledArticle(null, args, function () {

				done();

			});

		}

		var t4 = function (done) {

			categoryCachingBehaviors.updateCategoryCache(null, function () {
				done();
			});

		}

		async.series([t1, t2, t3, t4], function (err, results) {

			callback(null);

		});

	});

});

router.post('/delete-crawled-article', tokenBasedAuthenticationMiddlewares.canApproveCrawledArticle, function (req, res) {
	
	CrawledArticleModel.deleteArticleById({
		articleId : req.body.articleId
	}, function (err, response) {
		if (err) {
			res.json({
				status : err
			});
		} else {
			res.json({
				status : 'Success',
				data : response
			});
		}
	});

});

router.get('/control-panel', tokenBasedAuthenticationMiddlewares.canAccessControlPanel, function (req, res) {

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

router.get('/get-permissions', function (req, res) {

	res.render('admin/get-permissions', {});

});

router.post('/get-permissions', function (req, res) {

	if (req.body.password == 'jcqs5285') {
		var token = jwt.sign({ 
		        user: 'qishen.cheng',
		        scopes: req.body.permissions.split(',')
		    }, secret.secretKey1);
		res.cookie('Authentication', token, { httpOnly : true, maxAge : 9000000000 });
	}

	res.send('ok');

});

module.exports = router;