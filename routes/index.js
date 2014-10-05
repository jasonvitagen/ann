var express = require('express');
var router = express.Router();
var Article = require('../models/redis/Article').Article;
var webFrontIndexConfig = require('../config/webFront/index');

/* GET home page. */
router.get('/', function(req, res) {
  Article.getAllArticles(0, webFrontIndexConfig.articlesSize, function (articles) {
  	res.render('index', { 
  		title: 'Express',
  		pageUrl : req.protocol + '://' + req.get('host') + req.originalUrl,
  		articles : articles, 
  		message : req.flash('message') });
  });
});

router.get('/more/:number', function (req, res) {
  Article.getAllArticles(req.params.number, webFrontIndexConfig.articlesSize, function (articles) {
    res.json(articles);
  });
});

module.exports = router;
