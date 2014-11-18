var mongoose = require('mongoose')
	, articleSchema = require('./Article').articleSchema
	, categoryArticlesModel;

var categoryArticlesSchema = mongoose.Schema({

	name : String,
	articles : [articleSchema]

});

// Define indexes
categoryArticlesSchema.index({ name : 1 });

categoryArticlesSchema.statics.addArticleToRelatedCategory = function (doc) {
	this
		.findOne({ name : doc.category })
		.exec(function (err, category) {
			if (err) return err;
			if (category) {
				category.articles.push(doc);
				category.save(function (err) {
					if (err) return err;
				});
			} else {
				var category = new categoryArticlesModel({
					name : doc.category
				});
				category.articles.push(doc);
				category.save(function (err) {
					if (err) return err;
				});
			}
		});
}

categoryArticlesModel = mongoose.model('CategoryArticles', categoryArticlesSchema);

module.exports = {
	schema : categoryArticlesSchema,
	model  : categoryArticlesModel
}