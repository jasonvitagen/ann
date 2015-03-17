var express = require('express')
	, router = express.Router()
	, config = require('../config/redis')
	, category = require('../config/webfront/categories')
	, Category = require('../models/redis/Category').Category
	, webFrontIndexConfig = require('../config/webfront/index')
	, categoryRoutesBehaviors = require('./categoryRoutesBehaviors')
	, categoryCachingBehaviors = require('./behaviors/categoryCache');


router.get('/json/list', function (req, res) {
	
	categoryCachingBehaviors.getCategoryCache({

	}, function (err, response) {
		console.log(err);
		if (err) {
			return res.status(500).send(err);
		}
		res.json(response);
	});

});

router.get('/:categoryId/:categoryId2?', function (req, res) {
	categoryRoutesBehaviors.get.categoryArticles.v2(req, res);
});

router.get('/more/:categoryId/:number', function (req, res) {
	categoryRoutesBehaviors.get.categoryArticlesMore.v2(req, res);
});



module.exports = router;