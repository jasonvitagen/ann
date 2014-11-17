var mongoose = require('mongoose')
	, articleSchema = require('./Article').articleSchema;

var categoryArticlesSchema = mongoose.Schema({

	name : String,
	articles : [articleSchema]

});

// Define indexes
categoryArticlesSchema.index({ name : 1 });

module.exports = {
	schema : categoryArticlesSchema,
	model  : mongoose.model('Category', categoryArticlesSchema)
}