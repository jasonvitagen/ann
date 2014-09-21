var express = require('express');
var router = express.Router();
var Article = require('../models/redis/Article').Article;

/* GET home page. */
router.get('/', function(req, res) {
  Article.getAllArticles(0, 10, function (articles) {
  	console.log(articles);
  	res.render('index', { title: 'Express', articles : articles, message : req.flash('message') });

  });
});

module.exports = router;
