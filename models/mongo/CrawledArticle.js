var mongoose = require('mongoose');

var crawledArticleSchema = mongoose.Schema({
	created : {
		type : Date,
		default : Date.now
	},
	title       : String,
	crawledLink : String,
	thumbnail   : String,
	images		: [String],
	content     : String,
	category    : String,
	state       : {
		type : String,
		default : 'new'
	}
});

// Define indexes
crawledArticleSchema.index({ title : 1 });
crawledArticleSchema.index({ crawledLink : 1 });

crawledArticleSchema.statics.deleteArticleById = function (args, callback) {

	if (!args) {
		return callback('No arguments');
	}
	if (!args.articleId) {
		return callback('No "articleId" arg');
	}

	this
		.where({ _id : args.articleId })
		.findOneAndRemove(function (err, article) {
			if (err) {
				callback(err);
			} else {
				callback(null, article);
			}
		});

}

module.exports = mongoose.model('CrawledArticle', crawledArticleSchema);