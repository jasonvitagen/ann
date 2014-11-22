var mongoConfig = require('../config/mongo')
	, Article = require('../models/mongo/Article').model
	, PaginationLogic = require('../helpers/PaginationLogic')
	, categoriesTranslator = require('../helpers/categoriesTranslator')
	, category = require('../config/webfront/categories')
	, Category = require('../models/redis/Category').Category
	, webFrontIndexConfig = require('../config/webfront/index')
	, webfrontArticleConfig = require('../config/webfront/article')
	, routeBehaviors = {};

routeBehaviors.get = {};
routeBehaviors.get.categoryArticles = {};
routeBehaviors.get.categoryArticlesMore = {};

routeBehaviors.get.categoryArticles.v1 = function (req, res) {
	var param1 = category.categoriesCN[req.params.categoryId] || req.params.categoryId;
	var param2 = req.params.categoryId2 && category.categoriesCN[req.params.categoryId2] && ':' + category.categoriesCN[req.params.categoryId2] || '';
	var categoryId = param1 + param2;

	Category.getArticlesByCategory(categoryId, 0, webFrontIndexConfig.articlesSize, function (err, articles) {
		res.render('category/articles', {
			articles : articles,
			categoryId : categoryId
		});
	});
}

routeBehaviors.get.categoryArticles.v2 = function (req, res) {
	console.log(req.params.categoryId);
	console.log(req.params.categoryId2);
	var param1 = req.params.categoryId
		, param2 = req.params.categoryId2 && req.params.categoryId2 && mongoConfig.categoriesHierarchyDelimiter + req.params.categoryId2 || ''
		, categoryId = param1 + param2;

	var paginationLogic = new PaginationLogic({
		startNumber : webfrontArticleConfig.pagination.categoryArticles.startNumber,
		size : webfrontArticleConfig.pagination.categoryArticles.size
	});

	Article.getArticlesByCategory({
		startIndex : paginationLogic.getStartIndex(),
		size       : paginationLogic.getSize(),
		categoryId : categoryId
	}, function (err, articles) {
		if (err) {
			req.flash('message', webfrontArticleConfig.notificationMessages.getMyArticlesFailed);
			articles = [];
		}

		res.render('category/articles.ejs', { 
			articles   : articles,
			categoryId : categoryId,
			message    : req.flash('message') 
		});
	});

}

routeBehaviors.get.categoryArticlesMore.v1 = function (req, res) {
	Category.getArticlesByCategory(req.params.categoryId, req.params.number, webFrontIndexConfig.articlesSize, function (err, articles) {
		res.json(articles);
	});
}

routeBehaviors.get.categoryArticlesMore.v2 = function (req, res) {
	var paginationLogic = new PaginationLogic({
		startNumber : req.params.number,
		size : webfrontArticleConfig.pagination.categoryArticles.size
	});

	Article.getArticlesByCategory({
		startIndex : paginationLogic.getStartIndex(),
		size       : paginationLogic.getSize(),
		categoryId : req.params.categoryId
	}, function (err, articles) {

		if (err) {
			res.json([]);
		} else {
			res.json(articles);
		}
	});
}

module.exports = routeBehaviors;