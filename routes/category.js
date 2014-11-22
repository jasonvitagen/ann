var express = require('express')
	, router = express.Router()
	, config = require('../config/redis')
	, category = require('../config/webfront/categories')
	, Category = require('../models/redis/Category').Category
	, webFrontIndexConfig = require('../config/webfront/index')
	, categoryRoutesBehaviors = require('./categoryRoutesBehaviors');


router.get('/:categoryId/:categoryId2?', function (req, res) {
	categoryRoutesBehaviors.get.categoryArticles.v2(req, res);
});

router.get('/more/:categoryId/:number', function (req, res) {
	categoryRoutesBehaviors.get.categoryArticlesMore.v2(req, res);
});


module.exports = router;