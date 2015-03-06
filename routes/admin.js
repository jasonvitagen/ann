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

router.get('/list-crawled-articles', function (req, res) {

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

			// async.parallel([

			// 	function (done) {

			// 		imgur.uploadUrl({
			// 			imageUrl : req.body.thumbnail
			// 		}, function (err, response) {

			// 			if (!err) {
			// 				req.body.thumbnail = response.body.data.link;
			// 			}

			// 			done();

			// 		});

			// 	},

			// 	function (done) {

			// 		var i = 0;

			// 		async.each(req.body.images, function (img, done2) {

			// 			imgur.uploadUrl({
			// 				imageUrl : img
			// 			}, function (err, response) {

			// 				if (!err) {
			// 					try {
			// 						req.body.images.splice(i++, 1, response.body.data.link);
			// 					} catch (ex) {
			// 						console.log(ex);
			// 					}
			// 				}

			// 				done2();

			// 			});

			// 		}, function (err) {

			// 			done();

			// 		});

			// 	},

			// 	function (done) {

			// 		imgur.uploadAndReplace({
			// 			content : req.body.content
			// 		}, function (err, html) {
			// 			req.body.content = html;
			// 			done();
			// 		});

			// 	}

			// ], function (err, results) {

			// 	articleRoutesBehaviors.get.create.v1(req, res);

			// });

			articleRoutesBehaviors.get.create.v1(req, res);


		});



});

router.post('/list-crawled-article/:id', tokenBasedAuthenticationMiddlewares.canApproveCrawledArticle, dummy.randomizeUserName, function (req, res) {
	
	var id = req.params.id;


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