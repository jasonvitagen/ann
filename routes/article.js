var express  = require('express')
	, router   = express.Router()
	, Article  = require('../models/redis/Article').Article
	, category = require('../config/webfront/categories2')
	, mongoConfig = require('../config/mongo')
	, authMiddlewares = require('./middlewares/auth')
	, webFrontIndexConfig = require('../config/webfront/index')
	, articleRoutesBehaviors = require('./articleRoutesBehaviors');


router.get('/create', authMiddlewares.isLoggedIn, function (req, res) {
	articleRoutesBehaviors.get.create.v1(req, res);
});

router.post('/create', authMiddlewares.isLoggedIn, function (req, res) {
	articleRoutesBehaviors.post.create.v2(req, res);
});
 
router.get('/my-articles', authMiddlewares.isLoggedIn, function (req, res) {
	Article.getUserArticles(req.user, 0, webFrontIndexConfig.articlesSize, function (articles) {
		res.render('article/my-articles.ejs', { articles : articles, message : req.flash('message') });
	});
});

router.get('/my-articles/more/:number', authMiddlewares.isLoggedIn, function (req, res) {
	Article.getUserArticles(req.user, req.params.number, webFrontIndexConfig.articlesSize, function (articles) {
		res.json(articles);
	});
});

router.get('/random/:number?', function (req, res) {
	var number = req.params.number || 5;
	Article.getRandomArticles(number, function (err, articles) {
		res.json(articles);
	});
});

router.get('/:articleId/:title?', function (req, res) {
	Article.getArticleById(req.params.articleId, function (err, article) {
		if (err) {
			return res.redirect('/');
		}
		if (article) {
			res.locals.pageUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
			res.locals.facebookShare = true;
			res.locals.articleId = article.id;
			res.locals.pageTitle = article.title;
			res.locals.pageThumbnail = article.thumbnail;
			res.locals.pageDescription = '';
		}
		res.render('article/view', { 
			article : article
		});
	});
});

router.post('/delete', authMiddlewares.isLoggedIn, authMiddlewares.isArticleBelongedToUser, function (req, res) {
	Article.delete(req.user, req.body.articleId, req.body.articleCategory);
	res.redirect('/article/my-articles');
});

module.exports = router;