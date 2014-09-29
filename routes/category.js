var express = require('express');
var router = express.Router();
var Category = require('../models/redis/Category').Category;

router.get('/:categoryId', function (req, res) {
	console.log(req.params.categoryId);
	Category.getArticlesByCategory(req.params.categoryId, 0, 10, function (articles) {
		console.log(articles);
		res.redirect('/');
	});
});


module.exports = router;