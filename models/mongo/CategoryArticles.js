var mongoose = require('mongoose')
	, articleSchema = require('./Article').articleSchema
	, categoryArticlesModel;

var categoryArticlesSchema = mongoose.Schema({

	name : String,
	articles : [articleSchema]

});

// Define indexes
categoryArticlesSchema.index({ name : 1 });

categoryArticlesSchema.statics.addArticleToRelatedCategory = function (doc, callback) {
	this
		.findOne({ name : doc.category })
		.exec(function (err, category) {
			if (err) return callback(err);
			if (category) {
				category.articles.unshift(doc);
				category.save(function (err) {
					if (err) return callback(err);
					return callback();
				});
			} else {
				var category = new categoryArticlesModel({
					name : doc.category
				});
				category.articles.unshift(doc);
				category.save(function (err) {
					if (err) return callback(err);
					return callback();
				});
			}
		});
}

categoryArticlesModel = mongoose.model('CategoryArticles', categoryArticlesSchema);

module.exports = {
	schema : categoryArticlesSchema,
	model  : categoryArticlesModel
}