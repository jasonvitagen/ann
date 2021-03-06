var cacher = require('../../plugins/articleCacher')
	async = require('async')
	, apis = {};

apis.cacheCrawledArticle = function (err, args, callback) {

	if (!args) {
		return callback('No args');
	}
	if (!args.article
		|| !args.article.category) {
		return callback('No "article or article category" arg');
	}

	var t1 = function (done) {
		cacher.cacheArticleToPool({
			command : 'zadd',
			key : '首页',
			items : [args.article.articleId, args.article.articleId + '||' + args.article.title + '||' + args.article.thumbnail + '||' + args.article.authorName + '||' + args.article.category + '||' + Date.now()]
		}, function (err, response) {
			if (err) {
				console.log(err);
			}
			done();
		});
	}

	var t2 = function (done) {
		cacher.cacheArticleToPool({
			command : 'zadd',
			key : args.article.category,
			items : [args.article.articleId, args.article.articleId + '||' + args.article.title + '||' + args.article.thumbnail + '||' + args.article.authorName + '||' + args.article.category + '||' + Date.now()]
		}, function (err, response) {
			if (err) {
				console.log(err);
			}
			done();
		});
	}

	var t3 = function (done) {
		cacher.cacheArticle({
			key : 'article:' + args.article.articleId,
			items : {
				'articleId' : args.article.articleId,
				'title' : args.article.title,
				'authorName' : args.article.authorName,
				'category' : args.article.category,
				'thumbnail' : args.article.thumbnail,
				'content' : args.article.content
			}
		}, function (err, response) {
			done();
		});
	}
	
	async.parallel([t1, t2, t3], function (err, results) {
		return callback(null);
	});

}

apis.removeCachedArticles = function (args, callback) {

	if (!args) {
		return callback('No args');
	}
	if (!args.articleId) {
		return callback('No "articleId" arg');
	}
	if (!args.category) {
		return callback('No "category" arg');
	}

	var t1 = function (done) {

		cacher.removeArticleFromCachedPool({
			key : '首页',
			articleId : args.articleId
		}, function (err, response) {
			done();
		});

	}

	var t2 = function (done) {

		cacher.removeArticleFromCachedPool({
			key : args.category,
			articleId : args.articleId
		}, function (err, response) {
			done();
		});

	}

	var t3 = function (done) {

		cacher.removeArticleFromCache({
			key : 'article:' + args.articleId
		}, function (err, response) {
			done();
		});

	}

	async.parallel([t1, t2, t3], function (err, results) {
		return callback(null);
	});

}



module.exports = apis;