var mongoose = require('mongoose');

var crawledArticleSchema = mongoose.Schema({
	created : {
		type : Date,
		default : Date.now
	},
	title       : String,
	crawledLink : String,
	thumbnail   : String,
	content     : String
});

// Define indexes
crawledArticleSchema.index({ title : 1 });
crawledArticleSchema.index({ crawledLink : 1 });

module.exports = mongoose.model('CrawledArticle', crawledArticleSchema);