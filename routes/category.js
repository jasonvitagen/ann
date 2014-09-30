var express = require('express');
var router = express.Router();
var config = require('../config/redis');
var Category = require('../models/redis/Category').Category;

router.get('/:categoryId/:categoryId2?', function (req, res) {
	var category = req.params.categoryId + (req.params.categoryId2 ? ':' + req.params.categoryId2 : '');
	Category.getArticlesByCategory(category, 0, 10, function (articles) {
		res.render('category/articles', {
			articles : articles
		});
	});
});


module.exports = router;