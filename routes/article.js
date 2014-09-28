var express = require('express');
var router = express.Router();
var Article = require('../models/redis/Article').Article;
var authMiddlewares = require('./middlewares/auth');
var Category = require('../models/redis/Category');

router.get('/create', authMiddlewares.isLoggedIn, function (req, res) {
	res.render('articles/create', { message : req.flash('message'), categories : Category.categories, formBody : req.body });
});

router.post('/create', authMiddlewares.isLoggedIn, function (req, res) {
	if (!req.body.title ||
		!req.body.thumbnail ||
		!req.body.content) {
		console.log(req.body);
		req.flash('message', 'Fields cannot be blank');
		res.render('articles/create', { message : req.flash('message'), categories : Category.categories, formBody : req.body });
		return;
	}
	var article = new Article(req.body.title, req.body.thumbnail, req.body.category, req.body.content, req.user);
	article.save(req.user);
	res.redirect('/');
});

router.get('/my-articles', authMiddlewares.isLoggedIn, function (req, res) {
	Article.getUserArticles(req.user, 0, 10, function (response) {
		res.render('articles/my-articles.ejs', {});
	});
});

router.get('/r/:id', function (req, res) {
	console.log(req.params.id);
	Article.getArticleById(req.params.id, function (article) {
		res.render('articles/view', { 
			article : article,
			facebookShare : true,
			pageTitle : article.title,
			pageImage : article.thumbnail,
			pageDescription : article.content,
			pageUrl : req.protocol + '://' + req.get('host') + req.originalUrl
		});
	});
});


module.exports = router;