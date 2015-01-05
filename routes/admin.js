var express = require('express');
var router = express.Router();
var Article = require('../models/redis/Article').Article;
var authMiddlewares = require('./middlewares/auth');
var CrawledArticleModel = require('../models/mongo/CrawledArticle');
var articleRoutesBehaviors = require('./articleRoutesBehaviors');


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

router.get('/list-crawled-articles', authMiddlewares.isLoggedIn, authMiddlewares.isAdmin, function (req, res) {
	CrawledArticleModel
		.find()
		.sort({ created : -1 })
		.select({ title : 1, _id : 1 })
		.exec(function (err, crawledArticles) {
			console.log(crawledArticles);
			res.render('admin/list-crawled-articles', { crawledArticles : crawledArticles });
		});
});

router.get('/list-crawled-article/:id', authMiddlewares.isLoggedIn, authMiddlewares.isAdmin, function (req, res) {
	CrawledArticleModel
		.find()
		.where({ _id : req.params.id })
		.exec(function (err, crawledArticle) {
			crawledArticle = crawledArticle[0];
			req.body.title = crawledArticle.title;
			req.body.thumbnail = crawledArticle.thumbnail;
			req.body.content = crawledArticle.content;
			articleRoutesBehaviors.get.create.v1(req, res);
		});
});

router.post('/list-crawled-article/:id', authMiddlewares.isLoggedIn, authMiddlewares.isAdmin, function (req, res) {
	articleRoutesBehaviors.post.create.v2(req, res);
});

module.exports = router;