var async = require('async')
	, CrawledArticleModel = require('../models/mongo/CrawledArticle')
	, behaviors = {};

behaviors.filterOutDuplicateArticleLinks = function (args, callback) {
	if (!args) {
		return callback('No args');
	}
	if (!args.articleLinks) {
		return callback('No article links');
	}

	var articleLinks = [];

	async.each(args.articleLinks, function (articleLink, done) {
		CrawledArticleModel
			.findOne({ crawledLink : articleLink.link })
			.exec(function (err, crawledArticle) {
				if (err) {
					done(err);
				}
				if (crawledArticle) {
					done();
				} else {
					articleLinks.push(articleLink);
					done();
				}
			});
	}, function (err) {
		if (err) {
			return callback(err);
		}

		return callback(null, articleLinks);
	});

}

behaviors.saveCrawledArticles = function (args, callback) {
	if (!args) {
		return callback('No args');
	}
	if (!args.articles) {
		return callback('No articles in args');
	}

	CrawledArticleModel.create(args.articles, function (err) {
		if (err) {
			return callback(err);
		} else {
			return callback();
		}
	});

}

module.exports = behaviors;