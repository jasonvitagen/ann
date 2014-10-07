var express = require('express');
var router = express.Router();
var config = require('../config/redis');
var category = require('../models/redis/Category');
var webFrontIndexConfig = require('../config/webfront/index');


router.get('/:categoryId/:categoryId2?', function (req, res) {
	
	var param1 = category.categoriesCN[req.params.categoryId] || req.params.categoryId;
	var param2 = req.params.categoryId2 && category.categoriesCN[req.params.categoryId2] && ':' + category.categoriesCN[req.params.categoryId2] || '';
	var categoryId = param1 + param2;

	category.Category.getArticlesByCategory(categoryId, 0, webFrontIndexConfig.articlesSize, function (err, articles) {
		res.render('category/articles', {
			articles : articles,
			categoryId : categoryId
		});
	});
});

router.get('/more/:categoryId/:number', function (req, res) {
	category.Category.getArticlesByCategory(req.params.categoryId, req.params.number, webFrontIndexConfig.articlesSize, function (err, articles) {
		res.json(articles);
	});
});


module.exports = router;