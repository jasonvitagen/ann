var express = require('express');
var router = express.Router();
var Article = require('../models/redis/Article').Article;

/* GET home page. */
router.get('/', function(req, res) {
	var start = new Date().getTime();
	console.log('jason');
  Article.getAllArticles(0, 10, function (articles) {
  	res.render('index', { 
  		title: 'Express',
  		pageUrl : req.protocol + '://' + req.get('host') + req.originalUrl,
  		articles : articles, 
  		message : req.flash('message') });
  	console.log(new Date().getTime() - start);
  });
});

module.exports = router;
