var webfrontConfig = require('../../config/webfront/index')
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
				done();
			}

		}
		
		async.parallel([saveArticleId], function (err, results) {
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