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
var async = require('async');
var dummy = require('./middlewares/dummy');
var adminCachingBehaviors = require('./behaviors/adminCache');
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
			req.body.title = crawledArticle.title;
			req.body.thumbnail = crawledArticle.thumbnail;
			req.body.content = crawledArticle.content;
			req.body.images = crawledArticle.images;
			req.body.category = crawledArticle.category;

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

		if (!args
			|| !args.article) {
			console.log('No args');
			return callback('No "args"');
		}

		adminCachingBehaviors.cacheCrawledArticle(err, args, callback);

	});
});

module.exports = router;