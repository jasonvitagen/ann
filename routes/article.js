var express = require('express');
var router = express.Router();
var Article = require('../models/redis/Article').Article;
var authMiddlewares = require('./middlewares/auth');

router.get('/create', authMiddlewares.isLoggedIn, function (req, res) {
	res.render('articles/create', { message : req.flash('message') });
});

router.post('/create', authMiddlewares.isLoggedIn, function (req, res) {
	if (!req.body.title ||
		!req.body.thumbnail ||
		!req.body.content) {
		req.flash('message', 'Fields cannot be blank');
		res.redirect('./create');
		return;
	}
	var article = new Article(req.body.title, req.body.thumbnail, req.body.content, req.user);
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
		res.render('articles/view', { article : article });
	});
});


module.exports = router;