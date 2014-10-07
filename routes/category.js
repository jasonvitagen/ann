var express = require('express');
var router = express.Router();
var config = require('../config/redis');
var category = require('../config/webfront/categories');
var Category = require('../models/redis/Category').Category;
var webFrontIndexConfig = require('../config/webfront/index');


router.get('/:categoryId/:categoryId2?', function (req, res) {
	
	var param1 = category.categoriesCN[req.params.categoryId] || req.params.categoryId;
	var param2 = req.params.categoryId2 && category.categoriesCN[req.params.categoryId2] && ':' + category.categoriesCN[req.params.categoryId2] || '';
	var categoryId = param1 + param2;

	Category.getArticlesByCategory(categoryId, 0, webFrontIndexConfig.articlesSize, function (err, articles) {
		res.render('category/articles', {
			articles : articles,
			categoryId : categoryId
		});
	});
});

router.get('/more/:categoryId/:number', function (req, res) {
	Category.getArticlesByCategory(req.params.categoryId, req.params.number, webFrontIndexConfig.articlesSize, function (err, articles) {
		res.json(articles);
	});
});


module.exports = router;