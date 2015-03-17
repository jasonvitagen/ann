var articleCacher = require('../../plugins/articleCacher')
	, Article = require('../../models/mongo/Article').model
	, apis = {};



apis.getCachedArticle = function (args, callback) {

	if (!args) {
		return callback('No args');
	}
	if (!args.articleId) {
		return callback('No "articleId" arg');
	}

	articleCacher.getCachedArticle({
		key : 'article:' + args.articleId
	}, function (err, response) {
		if (err || !response) {
		
			Article.getArticleById({ // get via mongo
				articleId : args.articleId
			}, function (err, response) {
				console.log('get via mongo');
				if (err) {
					return callback(err);
				} else {
					return callback(null, response);
				}
			});

			return;

		}
		callback(null, response);
	});
	

}

apis.getCachedLatestArticles = function (args, callback) {

	if (!args) {
		return callback('No args');
	}
	if (!args.number) {
		return callback('No "number" arg');
	}
	if (!args.category) {
		args.category = '首页';
	}

	var size = 10
		, startIndex = size * args.number
		, endIndex = startIndex + size - 1;

	articleCacher.getCachedArticlesFromPool({
		command : 'zrevrange',
		key : args.category,
		options : [startIndex, endIndex]
	}, function (err, response) {

		if (err || response.length < 10) {

			var query = {};
			if (! (args.category == '首页')) {
				query.category = args.category;
			}

			Article.getAllArticles({
				startIndex : startIndex,
				size : size,
				fields : 'title thumbnail category authorName articleId',
				query: query
			}, function (err, response) {
				if (err) {
					return callback(err);
				} else {
					return callback(null, response);
				}

			});

			return;

		}
		callback(null, response);
	});

}

module.exports = apis;