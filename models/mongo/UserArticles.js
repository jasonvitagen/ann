var mongoose = require('mongoose')
	, articleSchema = require('./Article')
	, userArticlesModel;

var userArticlesSchema = mongoose.Schema({

	userId   : String,
	articles : [articleSchema]

});

userArticlesSchema.statics.addArticleToRelatedUser = function (doc) {
	this
		.findOne({ userId : doc.authorId })
		.exec(function (err, user) {
			if (err) return err;
			if (user) {
				user.articles.push(doc);
				user.save(function (err) {
					if (err) return err;
				});
			} else {
				var user = new userArticlesModel({
					userId : doc.authorId
				});
				user.articles.push(doc);
				user.save(function (err) {
					if (err) return err;
				});
			}
		});
}

userArticlesSchema.statics.getUserArticles = function (args, callback) {

	if (!args) {
		callback('No arguments');
		return;
	}

	var startIndex = args.startIndex
		, size = args.size;

	userArticlesModel
		.find()
		.skip(startIndex)
		.limit(size)
		.exec(function (err, articles) {
			if (err) {
				callback(err);
			} else {
				callback(null, articles);
			}
		});



}

userArticlesModel = mongoose.model('UserArticles', userArticlesSchema);

module.exports = {
	schema : userArticlesSchema,
	model  : userArticlesModel
}

