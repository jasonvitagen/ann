var config = require('../../config/redis');
var moment = require('moment');
var async = require('async');
var sanitizer = require('./articleSanitizer');

var client = null;

var article = {};

function setup (redisClient) {
	client = redisClient;
	client.setnx(config.keyNames.global.article.key, config.keyNames.global.article.value);
	return Article;
}

function Article (articleData) {

	articleData = sanitizer(articleData);

	article.title = articleData.title;
	article.thumbnail = articleData.thumbnail;
	article.category = articleData.category;
	article.content = articleData.content;
	article.created = new Date();
	article.createdShort = moment().format('D-M-YYYY');
	article.authorName = articleData.user.facebook.name || articleData.user.google.name || articleData.user.local.name;
	article.authorEmail = articleData.user.facebook.email || articleData.user.google.email || articleData.user.local.email;
	article.views = 0;
}

Article.getArticleById = function (id, callback) {
	id = config.keyNames.article.getId(id);
	client.hgetall(id, function (err, response) {
		if (err) {
			callback(err);
		} else {
			callback(null, response);
		}
	});
	client.hincrby(id, 'views', 1);
}

Article.getArticlesByIdList = function (idList, callback) {
	var articles = [];
	async.each(idList, function (id, done) {
		client.hgetall(id, function (err, response) {
			articles.push(response);
			done();
		});
	}, function (err) {
		callback(articles);
	});
}

Article.getUserArticles = function (user, number, size, callback) {
	var userArticlesId = config.keyNames.user.articles.getId(user.facebook.email || user.google.email || user.local.email);
	var startIndex = number * size;
	var endIndex = startIndex + size - 1;
	client.zrange([userArticlesId, startIndex, endIndex], function (err, idList) {
		Article.getArticlesByIdList(idList, function (articles) {
			callback(articles);
		});
	});
}

Article.getAllArticles = function (number, size, callback) {
	var articlesId = config.keyNames.articles.list.key;
	var startIndex = number * size;
	var endIndex = startIndex + size - 1;
	client.lrange([articlesId, startIndex, endIndex], function (err, idList) {
		Article.getArticlesByIdList(idList, function (articles) {
			callback(articles);
		});
	});
}

Article.getAllPendingConfirmationArticles = function (number, size, callback) {
	var pendingConfirmationArticlesId = config.keyNames.pending.pendingConfirmation.zset.articles;
	var startIndex = number * size;
	var endIndex = startIndex + size - 1;
	client.zrange([pendingConfirmationArticlesId, startIndex, endIndex], function (err, idList) {
		Article.getArticlesByIdList(idList, function (articles) {
			callback(articles);
		});
	});
}

Article.prototype.saveForPendingConfirmation = function (user, callback) {
	client.incr(config.keyNames.global.article.key, function (err, reply) {

		var articleId = config.keyNames.article.getId(reply);
		article.id = reply;

		function saveArticleToArticleId (done) {
			client.hmset(articleId, article, function (err, response) {
				if (err) { done(err); }
				else { console.log('article saved'); done(); }
			});
		}

		function saveArticleIdToPendingConfirmationArticlesInZset (done) {
			var pendingConfirmationArticlesInZsetId = config.keyNames.pending.pendingConfirmation.zset.articles;
			console.log(pendingConfirmationArticlesInZsetId);
			client.zadd([pendingConfirmationArticlesInZsetId, new Date().getTime(), articleId], function (err, response) {
				if (err) { done(err); }
				else { done(); }
			});
		}

		function asyncStoreProcedures (done) {
			async.parallel([saveArticleIdToPendingConfirmationArticlesInZset], function (err, results) {
				if (err) {
					console.log(err);
					done(err);
				} else {
					console.log('save pending article async store procedures success');
					done();
				}
			});
		}

		async.series([saveArticleToArticleId, asyncStoreProcedures], function (err, results) {
			article = {};
			if (err) {
				console.log(err);
				return callback(err);
			} else {
				console.log('save article to pending confirmation success');
				return callback();
			}
		});

	});
}

Article.confirmArticle = function (rawArticleId, callback) {

	var pendingConfirmationArticlesInZsetId = config.keyNames.pending.pendingConfirmation.zset.articles;
	var	article;

	articleId = config.keyNames.article.getId(rawArticleId);

	function checkIsArticleIdAvailableInPendingArticlesZset (done) {
		client.zrank([pendingConfirmationArticlesInZsetId, articleId], function (err, response) {
			if (err) {
				done(err);
			} else {
				if (response == null) {
					console.log('is null');
					done('article does not exist');
				} else {
					done();
				}
			}
		});
	}

	function getArticle (done) {
		Article.getArticleById(rawArticleId, function (err, response) {
			if (err) {
				done(err);
			} else {
				if (response == null) {
					done('no article exists');
				} else {
					article = response;
					done();
				}
			}
		});
	}

	// Store Procedures
	function saveArticleIdToUserArticles (done) {
		var userArticlesId = config.keyNames.user.articles.getId(article.authorEmail);
		client.zadd([userArticlesId, new Date().getTime(), articleId], function (err, response) {
			if (err) { done(err); }
			else { done(); }
		});
	}

	function saveArticleIdToArticlesInList (done) {
		var articlesInListId = config.keyNames.articles.list.key;
		client.lpush([articlesInListId, articleId], function (err, response) {
			if (err) { done(err); }
			else { done(); }
		});
	}

	function saveArticleIdToArticlesInSet (done) {
		var articlesInSetId = config.keyNames.articles.set.key;
		client.sadd([articlesInSetId, articleId], function (err, response) {
			if (err) { done(err); }
			else { done(); }
		});
	}

	function saveArticleIdToCategoryArticles (done) {
		var categoryArticlesId = config.keyNames.category.articles.getId(article.category);
		client.zadd([categoryArticlesId, new Date().getTime(), articleId], function (err, response) {
			if (err) { done(err); }
			else { done(); }
		});
	}

	function asyncStoreProcedures (done) {
		async.parallel([saveArticleIdToUserArticles, saveArticleIdToArticlesInList, saveArticleIdToArticlesInSet, saveArticleIdToCategoryArticles], function (err, results) {
			if (err) {
				console.log(err);
				done(err);
			} else {
				done();
			}
		});
	}

	function deleteArticleIdFromPendingArticlesZset (done) {
	 client.zrem([pendingConfirmationArticlesInZsetId, articleId], function (err, response) {
	 	if (err) {
	 		done(err);
	 	} else {
	 		done();
	 	}
	 });
	}



	async.series([checkIsArticleIdAvailableInPendingArticlesZset, getArticle, asyncStoreProcedures, deleteArticleIdFromPendingArticlesZset], function (err, results) {
		if (err) {
			return callback(err);
		} else {
			return callback();
		}
	});

}

Article.prototype.save = function (user, callback) {
	client.incr(config.keyNames.global.article.key, function (err, reply) {
		
		var articleId = config.keyNames.article.getId(reply);
		article.id = reply;

		function saveArticleToArticleId (done) {
			client.hmset(articleId, article, function (err, response) {
				if (err) { done(err); }
				else { console.log('article saved'); done(); }
			});
		}

		// Store Procedures
		function saveArticleIdToUserArticles (done) {
			var userArticlesId = config.keyNames.user.articles.getId(user.facebook.email || user.google.email || user.local.email);
			client.zadd([userArticlesId, new Date().getTime(), articleId], function (err, response) {
				if (err) { done(err); }
				else { done(); }
			});
		}

		function saveArticleIdToArticlesInList (done) {
			var articlesInListId = config.keyNames.articles.list.key;
			client.lpush([articlesInListId, articleId], function (err, response) {
				if (err) { done(err); }
				else { done(); }
			});
		}

		function saveArticleIdToArticlesInSet (done) {
			var articlesInSetId = config.keyNames.articles.set.key;
			client.sadd([articlesInSetId, articleId], function (err, response) {
				if (err) { done(err); }
				else { done(); }
			});
		}

		function saveArticleIdToCategoryArticles (done) {
			console.log(article.category);
			var categoryArticlesId = config.keyNames.category.articles.getId(article.category);
			console.log(categoryArticlesId);
			client.zadd([categoryArticlesId, new Date().getTime(), articleId], function (err, response) {
				if (err) { done(err); }
				else { done(); }
			});
		}

		function asyncStoreProcedures (done) {
			async.parallel([saveArticleIdToUserArticles, saveArticleIdToArticlesInList, saveArticleIdToArticlesInSet, saveArticleIdToCategoryArticles], function (err, results) {
				if (err) {
					console.log(err);
					done(err);
				} else {
					console.log('save article id async store procedures success');
					done();
				}
			});
		}

		async.series([saveArticleToArticleId, asyncStoreProcedures], function (err, results) {
			article = {};
			if (err) {
				console.log(err);
				return callback(err);
			} else {
				console.log('save article success');
				return callback();
			}
		});

	});
}

Article.delete = function (user, articleId, articleCategory) {

	var articleId = config.keyNames.article.getId(articleId);

	function deleteArticleFromArticleId (done) {
		client.del(articleId, function (err, response) {
			if (err) { done(err); }
			else { console.log('article removed'); done(); }
		});
	}

	// Store Procedures
	function deleteArticleIdFromUserArticles (done) {
		var userArticlesId = config.keyNames.user.articles.getId(user.facebook.email || user.google.email || user.local.email);
		client.zrem([userArticlesId, articleId], function (err, response) {
			if (err) { done(err); }
			else { done(null, 1); }
		});
	}

	function deleteArticleIdFromArticlesInList (done) {
		var articlesInListId = config.keyNames.articles.list.key;
		client.lrem([articlesInListId, 0, articleId], function (err, response) {
			if (err) { done(err); }
			else { done(null, 2); }
		});
	}

	function deleteArticleIdFromArticlesInSet (done) {
		var articlesInSetId = config.keyNames.articles.set.key;
		client.srem([articlesInSetId, articleId], function (err, response) {
			if (err) { done(err); }
			else { done(null, 3); }
		});
	}

	function deleteArticleIdFromCategoryArticles (done) {
		var categoryArticlesId = config.keyNames.category.articles.getId(articleCategory);
		client.zrem([categoryArticlesId, articleId], function (err, response) {
			if (err) { done(err); }
			else { done(null, 4); }
		});
	}

	function asyncStoreProcedures (done) {
		async.parallel([deleteArticleIdFromUserArticles, deleteArticleIdFromArticlesInList, deleteArticleIdFromArticlesInSet, deleteArticleIdFromCategoryArticles], function (err, results) {
			if (err) {
				console.log(err);
				done(err);
			} else {
				console.log('delete article id async store procedures success');
				done();
			}
		});
	}

	async.series([deleteArticleFromArticleId, asyncStoreProcedures], function (err, results) {
		if (err) {
			console.log(err);
		} else {
			console.log('delete article success');
		}
	});

}

Article.isUserHasArticle = function (user, articleId, callback) {
	var userArticlesId = config.keyNames.user.articles.getId(user.facebook.email || user.google.email || user.local.email);
	articleId = config.keyNames.article.getId(articleId);
	client.zrank([userArticlesId, articleId], function (err, response) {
		if (response != null) {
			callback(true);
		} else {
			callback(false);
		}
	});
}

Article.getRandomArticles = function (number, callback) {
	var articlesInSetId = config.keyNames.articles.set.key;
	client.srandmember([articlesInSetId, number + 1], function (err, articlesId) {
		Article.getArticlesByIdList(articlesId, function (articles) {
			callback(articles);
		});
	});
}


module.exports = {
	setup : setup,
	Article : Article
};