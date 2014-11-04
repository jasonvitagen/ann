var mongoose = require('mongoose'),
	categorySchema = require('./Category').schema;

var articleSchema = mongoose.Schema({

	title : String,
	thumbnail : String,
	categories : [categorySchema],


});

module.exports = {
	schema : articleSchema,
	model  : mongoose.model('Article', articleSchema)
};