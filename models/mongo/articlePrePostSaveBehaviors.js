var webfrontConfig = require('../../config/webfront/index')
	, categoryArticles = require('./CategoryArticles').model
	, userArticles = require('./UserArticles').model
	, shortId = require('short-mongo-id')
	, async = require('async');


function setupPreSave (schema, articleModel) {

	schema.pre('save', function (next) {
		this.categoryUrl = '/' + webfrontConfig.categoryBaseUrlName + '/' + this.category.replace(':', '/');
		next();
	});

}

function setupPostSave (schema, articleModel) {

	schema.post('save', function (doc) {

		console.log('lala');

		function saveArticleId (done) {

			if (!doc.articleId) {

				var articleId = shortId(doc._id);
				doc.articleId = articleId;

				articleModel.findByIdAndUpdate(
					doc._id, 
					{ 
						$set : { articleId : articleId }
					},
					{},
					function (err, doc) {
						if (err) {
							done(err);
						} else {
							done();
						}
					}
				);
			} else {
				console.log('a-2');
				done();
			}

		}

		function addArticleToRelatedCategory (done) {
			console.log('b');
			categoryArticles.addArticleToRelatedCategory(doc, function (err) {
				if (err) {
					done(err);
				} else {
					done();
				}
			});

		}

		function addArticleToRelatedUser (done) {
			console.log('c');
			userArticles.addArticleToRelatedUser(doc, function (err) {
				if (err) {
					done(err);
				} else {
					done();
				}
			});

		}

		
		function asyncTasks (done) {
			async.parallel([addArticleToRelatedCategory, addArticleToRelatedUser], function (err, results) {
				if (err) {
					done(err);
				} else {
					console.log('d');
					done();
				}
			});
		}

		async.series([saveArticleId, asyncTasks], function (err, results) {
			if (err) {
				console.log(err);
			} else {
				console.log('post save article successful');
			}
		});


	});

}

module.exports = {
	setupPreSave : setupPreSave,
	setupPostSave : setupPostSave
}