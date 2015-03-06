var Article = require('../models/redis/Article').Article
	, webFrontIndexConfig = require('../config/webfront/index')
	, webfrontArticleConfig = require('../config/webfront/article')
	, PaginationLogic = require('../helpers/PaginationLogic')
	, routeBehaviors = {}
	, Article = require('../models/mongo/Article').model;

routeBehaviors.get = {};
routeBehaviors.get.index = {};
routeBehaviors.get.indexMore = {};


routeBehaviors.get.index.v1 = function (req, res) {
	Article.getAllArticles(0, webFrontIndexConfig.articlesSize, function (articles) {
  	res.render('index', { 
  		title: 'Express',
  		pageUrl : req.protocol + '://' + req.get('host') + req.originalUrl,
  		articles : articles, 
  		message : req.flash('message') });
  });
}
routeBehaviors.get.index.v2 = function (req, res) {

	var paginationLogic = new PaginationLogic({
		startNumber : webfrontArticleConfig.pagination.index.startNumber,
		size : webfrontArticleConfig.pagination.index.size
	});

	Article.getAllArticles({
		startIndex : paginationLogic.getStartIndex(),
		size : paginationLogic.getSize()
	}, function (err, articles) {
		if (err) {
			req.flash('message', webfrontArticleConfig.notificationMessages.getMyArticlesFailed);
			res.render('index', { 
				articles : articles,
				message : req.flash('message') 
			});
		} else {
			res.render('index', {
				articles : articles
			});
		}
	});
}
routeBehaviors.get.indexMore.v1 = function (req, res) {
	Article.getAllArticles(req.params.number, webFrontIndexConfig.articlesSize, function (articles) {
		res.json(articles);
	});
}
routeBehaviors.get.indexMore.v2 = function (req, res) {

	var paginationLogic = new PaginationLogic({
		startNumber : req.params.number,
		size : webfrontArticleConfig.pagination.index.size
	});

	Article.getAllArticles({
		startIndex : paginationLogic.getStartIndex(),
		size : paginationLogic.getSize()
	}, function (err, articles) {
		if (err) {
			res.json([]);
		} else {
			res.json(articles);
		}
	});
}






module.exports = routeBehaviors;