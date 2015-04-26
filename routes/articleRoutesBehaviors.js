var RedisArticle = require('../models/redis/Article').Article
	, Article = require('../models/mongo/Article').model
	, category = require('../config/webfront/categories2')
	, mongoConfig = require('../config/mongo')
	, PaginationLogic = require('../helpers/PaginationLogic')
	, webfrontArticleConfig = require('../config/webfront/article')
	, routeBehaviors = {}
	, conzh = require('../plugins/conzh');
	

routeBehaviors.get = {};
routeBehaviors.get.create = {};
routeBehaviors.get.myArticles = {};
routeBehaviors.get.myArticlesMore = {};
routeBehaviors.get.getArticleById = {};
routeBehaviors.get.edit = {};

routeBehaviors.get.create.v1 = function (req, res) {
	res.render('article/create', { categoriesStructure : category.categoriesStructure, mongoConfig : mongoConfig, formBody : req.body });
}
routeBehaviors.get.myArticles.v1 = function (req, res) {
	Article.getUserArticles(req.user, 0, webFrontIndexConfig.articlesSize, function (err, articles) {
		if (err) {
			console.log('error while getting my articles');
		} else {
			res.render('article/my-articles.ejs', { articles : articles, message : req.flash('message') });	
		}
	});
}
routeBehaviors.get.myArticles.v2 = function (req, res) {

	var paginationLogic = new PaginationLogic({
		startNumber : webfrontArticleConfig.pagination.myArticles.startNumber,
		size : webfrontArticleConfig.pagination.myArticles.size
	});

	Article.getUserArticles({
		startIndex : paginationLogic.getStartIndex(),
		size       : paginationLogic.getSize(),
	}, function (err, articles) {

		if (err) {
			req.flash('message', webfrontArticleConfig.notificationMessages.getMyArticlesFailed);
			res.render('article/my-articles.ejs', { articles : [] });
		} else {
			res.render('article/my-articles.ejs', { articles : articles });
		}
	});
}
routeBehaviors.get.myArticlesMore.v1 = function (req, res) {
	Article.getUserArticles(req.user, req.params.number, webFrontIndexConfig.articlesSize, function (articles) {
		res.json(articles);
	});
}
routeBehaviors.get.myArticlesMore.v2 = function (req, res) {

	var paginationLogic = new PaginationLogic({
		startNumber : req.params.number,
		size : webfrontArticleConfig.pagination.myArticles.size
	});

	Article.getUserArticles({
		startIndex : paginationLogic.getStartIndex(),
		size       : paginationLogic.getSize(),
	}, function (err, articles) {
		if (err) {
			res.json([]);
		} else {
			res.json(articles);
		}
	});
}
routeBehaviors.get.getArticleById.v1 = function (req, res) {
	Article.getArticleById(req.params.articleId, function (err, article) {
		if (err) {
			return res.redirect('/');
		}
		if (article) {
			res.locals.pageUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
			res.locals.facebookShare = true;
			res.locals.articleId = article.id;
			res.locals.pageTitle = article.title;
			res.locals.pageThumbnail = article.thumbnail;
			res.locals.pageDescription = '';
		}
		res.render('article/view', {
			article : article
		});
	});
}
routeBehaviors.get.getArticleById.v2 = function (req, res) {

	Article.getArticleById({
		articleId : req.params.articleId
	}, function (err, article) {
		if (err) {
			res.status(404).send(webfrontArticleConfig.notificationMessages.articleNotFound);
		} else {
			res.render('article/view', {
				article : article,
				articleId : req.params.articleId,
				pageUrl : req.currentPageUrl,
				facebookShare : {
					pageUrl : req.currentPageUrl,
					pageTitle : article.title,
					pageDescription : article.title,
					pageThumbnail : article.thumbnail
				}
			});
		}
	});
}
routeBehaviors.get.edit.v1 = function (req, res) {
	Article.getArticleById({
		articleId : req.params.articleId
	}, function (err, article) {
		if (err) {
			res.redirect(webfrontArticleConfig.edit.redirections.articleEditedFailed);
		} else {
			req.body = article;
			res.render('article/create', { categoriesStructure : category.categoriesStructure, mongoConfig : mongoConfig, formBody : req.body });
		}
	});
}

routeBehaviors.post = {};
routeBehaviors.post.create = {};
routeBehaviors.post.delete = {};
routeBehaviors.post.edit = {};

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

routeBehaviors.post.create.v2 = function (req, res, callback) {
	var article = new Article({
		articleId   : req.body.articleId,
		authorName  : req.decoded.user,
		authorEmail : req.decoded.user,
		authorId    : req.decoded.user,
		title       : req.body.title,
		thumbnail   : req.body.thumbnail,
		category    : req.body.category,
		content     : req.body.content
	});

	article.title = conzh(article.title);
	article.content = conzh(article.content);

	article.save(function (err) {
		if (err) {
			res.render('article/create', { categoriesStructure : category.categoriesStructure, mongoConfig : mongoConfig, formBody : req.body });
			return;
		}
		callback && callback(err, {
			article : article
		}, function (err) {
			if (err) {
				res.status(500).send(err);
			} else {
				res.json({
					'status' : 'ok'
				});
			}
		});
	});
}

routeBehaviors.post.delete.v1 = function (req, res) {
	Article.delete(req.user, req.body.articleId, req.body.articleCategory);
	res.redirect('/article/my-articles');
}

routeBehaviors.post.delete.v2 = function (req, res, callback) {
	Article.deleteArticleById({
		articleId : req.body.articleId
	}, function (err, article) {
		if (err) {
			res.redirect(webfrontArticleConfig.delete.redirections.articleDeletedFailed);
		} else {
			if (!article) {
				res.redirect(webfrontArticleConfig.delete.redirections.articleDeletedFailed);
			} else {
				callback && callback(err, function (err) {
					if (err) {
						return res.status(500).send(err);
					}
					res.redirect(webfrontArticleConfig.delete.redirections.articleDeletedSuccessful);
				});
			}
		}
	});
}

routeBehaviors.post.edit.v1 = function (req, res, callback) {
	Article.findById(req.body.id, function (err, article) {
		if (err) {
			console.log(err);
			req.flash('message', webfrontArticleConfig.notificationMessages.editArticleFailed);
			res.redirect(webfrontArticleConfig.edit.redirections.articleEditedFailed);
		} else {
			article.title     = req.body.title;
			article.content   = req.body.content;
			article.category  = req.body.category;
			article.thumbnail = req.body.thumbnail;
			article.oldCategory = req.body.oldCategory;

			article.save(function (err) {
				if (err) {
					res.redirect(webfrontArticleConfig.edit.redirections.articleEditedFailed);
				} else {
					callback && callback(err, {
						article : article
					}, function (err) {
						if (err) {
							return res.status(500).send(err);
						}
						res.redirect(webfrontArticleConfig.edit.redirections.articleEditedSuccessful);
					})
				}
			})
		}
	});
}


module.exports = routeBehaviors;