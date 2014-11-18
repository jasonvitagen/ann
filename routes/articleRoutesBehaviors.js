var RedisArticle = require('../models/redis/Article').Article
	, MongoArticle = require('../models/mongo/Article').model
	, category = require('../config/webfront/categories2')
	, mongoConfig = require('../config/mongo')
	, PaginationLogic = require('../helpers/PaginationLogic')
	, userArticles = require('../models/mongo/UserArticles').model
	, webfrontArticleConfig = require('../config/webfront/article')
	, routeBehaviors = {};
	

routeBehaviors.get = {};
routeBehaviors.get.create = {};
routeBehaviors.get.myArticles = {};

routeBehaviors.get.create.v1 = function (req, res) {
	res.render('article/create', { message : req.flash('message'), categoriesStructure : category.categoriesStructure, mongoConfig : mongoConfig, formBody : req.body });
}
routeBehaviors.get.myArticles.v1 = function (req, res) {
	Article.getUserArticles(req.user, 0, webFrontIndexConfig.articlesSize, function (articles) {
		res.render('article/my-articles.ejs', { articles : articles, message : req.flash('message') });
	});
}
routeBehaviors.get.myArticles.v2 = function (req, res) {

	var paginationLogic = new PaginationLogic({
		startNumber : webfrontArticleConfig.pagination.myArticles.startNumber,
		size : webfrontArticleConfig.pagination.myArticles.size
	});

	userArticles.getUserArticles({
		startIndex : paginationLogic.getStartIndex(),
		size : paginationLogic.getSize()
	}, function (err, articles) {
		if (err) {
			req.flash('message', webfrontArticleConfig.notificationMessages.getMyArticlesFailed);
			res.render('article/my-articles.ejs', { articles : [], message : req.flash('message') });
		} else {
			console.log(articles);
			res.render('article/my-articles.ejs', { articles : articles, message : req.flash('message') });
		}
	});
}

routeBehaviors.post = {};
routeBehaviors.post.create = {};
routeBehaviors.post.create.v1 = function (req, res) {
	if (!req.body.title ||
		!req.body.thumbnail ||
		!req.body.content) {
		req.flash('message', 'Fields cannot be blank');
		res.render('article/create', { message : req.flash('message'), categoriesStructure : category.categoriesStructure, mongoConfig : mongoConfig, formBody : req.body });
		return;
	}
	var article = new RedisArticle({
		title     : req.body.title,
		thumbnail : req.body.thumbnail,
		category  : req.body.category,
		content   : req.body.content,
		user      : req.user
	});
	if (req.user.role == 'admin') {
		article.save(req.user, function (err) {
			if (err) {
				req.flash('message', 'There is a problem in creating your article');
			} else {
				req.flash('message', 'Your article has been created successfully');
			}
			res.redirect('/');
		});
	} else {
		article.saveForPendingConfirmation(req.user, function (err) {
			if (err) {
				req.flash('message', 'There is a problem in creating your article');
			} else {
				req.flash('message', 'Your article has been created for confirmation');
			}
			res.redirect('/');	
		});
	}
}

routeBehaviors.post.create.v2 = function (req, res) {
	var article = new MongoArticle({
		authorName  : req.user.facebook.name || req.user.google.name || req.user.local.name,
		authorEmail : req.user.facebook.email || req.user.google.email || req.user.local.email,
		authorId    : req.user._id,
		title       : req.body.title,
		thumbnail   : req.body.thumbnail,
		category    : req.body.category,
		content     : req.body.content
	});
	article.save(function (err) {
		if (err) {
			req.flash('message', webfrontArticleConfig.save.failedMessage);
		} else {
			req.flash('message', webfrontArticleConfig.save.successMessage);
		}
		res.redirect(webfrontArticleConfig.save.redirections.articleCreatedSuccessful);
	});
	return;
}

module.exports = routeBehaviors;