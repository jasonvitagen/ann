var cacher = require('../../plugins/articleCacher')
	async = require('async')
	, apis = {};

apis.cacheCrawledArticle = function (err, args, callback) {

	var t1 = function (done) {
		cacher.cacheArticleToPool({
			command : 'zadd',
			key : 'articlesPool',
			items : [Date.now(), args.article.title + '||' + args.article.thumbnail + '||' + args.article.authorName + '||' + args.article.category + '||' + Date.now()]
		}, function (err, response) {
			if (err) {
				console.log(err);
			}
			done();
		});
	}

	var t2 = function (done) {
		cacher.cacheArticle({
			key : 'article:' + args.article._id,
			items : {
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
	
	async.parallel([t1, t2], function (err, results) {
		return callback(null);
	});

}

module.exports = apis;