var webfrontConfig = require('../../config/webfront/index')
	, categoryArticles = require('./CategoryArticles').model
	, userArticles = require('./UserArticles').model
	, shortId = require('short-mongo-id')
	, async = require('async');


function setupPreSave (schema) {

	schema.pre('save', function (next) {
		this.categoryUrl = '/' + webfrontConfig.categoryBaseUrlName + '/' + this.category.replace(':', '/');
		next();
	});

}

function setupPostSave (schema) {

	function saveArticleId (done) {
		schema.post('save', function (doc) {
			if (!doc.articleId) {
				doc.articleId = shortId(doc._id);
				doc.save(function (err) {
					done();
				});
			} else {
				done();
			}
		});
	}

	function addArticleToRelatedCategory (done) {
		schema.post('save', function (doc) {
			categoryArticles.addArticleToRelatedCategory(doc, done);
		});
	}

	function addArticleToRelatedUser (done) {
		schema.post('save', function (doc) {
			userArticles.addArticleToRelatedUser(doc, done);
		});
	}

	function asyncTasks (done) {
		async.parallel([addArticleToRelatedCategory, addArticleToRelatedUser], function (err, results) {
			done();
		});
	}

	async.series([saveArticleId, asyncTasks], function (err, results) {
		if (!err) {
			console.log('Post save article successful');
		}
	});

}

module.exports = {
	setupPreSave : setupPreSave,
	setupPostSave : setupPostSave
}