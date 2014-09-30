var config = require('../../config/redis');
var moment = require('moment');

var client = null;

var article = {};

function setup (redisClient) {
	client = redisClient;
	client.setnx(config.keyNames.global.article.key, config.keyNames.global.article.value);
	return Article;
}

function Article (title, thumbnail, category, content, user) {
	article.title = title;
	article.thumbnail = thumbnail;
	article.category = category;
	article.content = content;
	article.created = new Date();
	article.createdShort = moment().format('D-M-YYYY');
	article.authorName = user.facebook.name || user.google.name || user.local.name;
	article.authorEmail = user.facebook.email || user.google.email || user.local.email;
	article.views = 0;
}

Article.getArticleById = function (id, callback) {
	id = config.keyNames.article.getId(id);
	client.hgetall(id, function (err, response) {
		callback(response);
	});
	client.hincrby(id, 'views', 1);
}

Article.getArticlesByIdList = function (idList, callback) {
	var count = 0;
	var articles = [];
	if (idList.length <= 0) {
		callback(articles);
	}
	for (var i = 0, len = idList.length; i < len; i++) {
		var id = idList[i];
		client.hgetall(id, function (err, response) {
			articles.push(response);
			count++;
			if (count == len) {
				callback(articles);
			}
		});
	}
}

Article.getUserArticles = function (user, number, size, callback) {
	var userArticlesId = config.keyNames.user.articles.getId(user.facebook.email || user.google.email || user.local.email);
	var startIndex = number * size;
	var endIndex = startIndex + size;
	client.zrange([userArticlesId, startIndex, endIndex], function (err, idList) {
		Article.getArticlesByIdList(idList, function (articles) {
			callback(articles);
		});
	});
}

Article.getAllArticles = function (number, size, callback) {
	var articlesId = config.keyNames.articles.key;
	var startIndex = number * size;
	var endIndex = startIndex + size - 1;
	client.lrange([articlesId, startIndex, endIndex], function (err, idList) {
		Article.getArticlesByIdList(idList, function (articles) {
			callback(articles);
		});
	});
}

Article.prototype.save = function (user) {
	client.incr(config.keyNames.global.article.key, function (err, reply) {
		
		var articleId = config.keyNames.article.getId(reply);
		article.id = reply;
		client.hmset(articleId, article);

		var userArticlesId = config.keyNames.user.articles.getId(user.facebook.email || user.google.email || user.local.email);
		client.zadd([userArticlesId, new Date().getTime(), articleId], function (err, response) {
		});

		var articlesId = config.keyNames.articles.key;
		client.lpush(articlesId, articleId);

		var categoryArticlesId = config.keyNames.category.articles.getId(article.category);
		client.zadd([categoryArticlesId, new Date().getTime(), articleId], function (err, response) {
		});

		article = {};
	});
}

Article.delete = function (user, articleId) {
	var articleId = config.keyNames.article.getId(articleId);
	client.del(articleId, function (err, response) {
		console.log(response);
	});

	var articlesId = config.keyNames.articles.key;
	client.lrem(articlesId, 0, articleId);

	var userArticlesId = config.keyNames.user.articles.getId(user.facebook.email || user.google.email || user.local.email);
	client.zrem(userArticlesId, articleId);

	var categoryArticlesId = config.keyNames.category.articles.getId(article.category);
	client.zrem(categoryArticlesId, articleId);

}


module.exports = {
	setup : setup,
	Article : Article
};