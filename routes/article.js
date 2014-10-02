var express = require('express');
var router = express.Router();
var Article = require('../models/redis/Article').Article;
var authMiddlewares = require('./middlewares/auth');
var Category = require('../models/redis/Category');

router.get('/create', authMiddlewares.isLoggedIn, function (req, res) {
	res.render('article/create', { message : req.flash('message'), categories : Category.categories, categoriesCN : Category.categoriesCN, formBody : req.body });
});

router.post('/create', authMiddlewares.isLoggedIn, function (req, res) {
	if (!req.body.title ||
		!req.body.thumbnail ||
		!req.body.content) {
		req.flash('message', 'Fields cannot be blank');
		res.render('article/create', { message : req.flash('message'), categories : Category.categories, categoriesCN : Category.categoriesCN, formBody : req.body });
		return;
	}
	var article = new Article({
		title     : req.body.title,
		thumbnail : req.body.thumbnail,
		category  : req.body.category,
		content   : req.body.content,
		user      : req.user
	});
	article.save(req.user);
	res.redirect('/');
});
 
router.get('/my-articles', authMiddlewares.isLoggedIn, function (req, res) {
	Article.getUserArticles(req.user, 0, 10, function (articles) {
		res.render('article/my-articles.ejs', { articles : articles, message : req.flash('message') });
	});
});

router.get('/random/:number?', function (req, res) {
	// var number = req.params.number || 5;
	// Article.getRandomArticles(number, function (articles) {
	// 	res.json(articles);
	// });
	res.json([
{
title: "1",
thumbnail: "1",
category: "movie",
content: "<p>1</p>",
created: "Wed Oct 01 2014 22:45:59 GMT-0400 (EDT)",
createdShort: "1-10-2014",
authorName: "Jason C",
authorEmail: "jasonvitagen@gmail.com",
views: "151",
id: "10001"
},
{
title: "2",
thumbnail: "2",
category: "movie",
content: "<p>2</p>",
created: "Wed Oct 01 2014 22:46:08 GMT-0400 (EDT)",
createdShort: "1-10-2014",
authorName: "Jason C",
authorEmail: "jasonvitagen@gmail.com",
views: "127",
id: "10002"
}
])
	
});

router.get('/:articleId', function (req, res) {
	Article.getArticleById(req.params.articleId, function (article) {
		res.render('article/view', { 
			article : article,
			facebookShare : true,
			pageTitle : article && article.title || '',
			pageImage : article && article.thumbnail || '',
			pageDescription : article && article.content || '',
			pageUrl : req.protocol + '://' + req.get('host') + req.originalUrl
		});
	});
});

router.post('/delete', authMiddlewares.isLoggedIn, authMiddlewares.isArticleBelongedToUser, function (req, res) {
	Article.delete(req.user, req.body.articleId, req.body.articleCategory);
	res.redirect('/article/my-articles');
});

module.exports = router;