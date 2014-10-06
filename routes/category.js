var express = require('express');
var router = express.Router();
var config = require('../config/redis');
var category = require('../models/redis/Category');

router.get('/:categoryId/:categoryId2?', function (req, res) {
	
	var param1 = category.categoriesCN[req.params.categoryId] || req.params.categoryId;
	var param2 = req.params.categoryId2 && category.categoriesCN[req.params.categoryId2] && ':' + category.categoriesCN[req.params.categoryId2] || '';
	var categoryId = param1 + param2;

	category.Category.getArticlesByCategory(categoryId, 0, 20, function (articles) {
		res.render('category/articles', {
			articles : articles
		});
	});
});


module.exports = router;