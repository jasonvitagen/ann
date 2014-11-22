var mongoose = require('mongoose')
	, articleSchema = require('./Article')
	, userArticlesModel;

var userArticlesSchema = mongoose.Schema({

	userId   : String,
	articles : [articleSchema]

});

userArticlesSchema.statics.addArticleToRelatedUser = function (doc, callback) {
	this
		.findOne({ userId : doc.authorId })
		.exec(function (err, user) {
			if (err) return callback(err);
			if (user) {
				user.articles.unshift(doc);
				user.save(function (err) {
					if (err) callback(err);
					return callback();
				});
			} else {
				var user = new userArticlesModel({
					userId : doc.authorId
				});
				user.articles.unshift(doc);
				user.save(function (err) {
					if (err) return callback(err);
					return callback();
				});
			}
		});
}

userArticlesSchema.statics.getUserArticles = function (args, callback) {

	if (!args) {
		return callback('No arguments');
	}

	var startIndex = args.startIndex
		, size = args.size;

	this.findOne(
		{ 
			'userId' : args.authorId 
		},
		{
			articles : { $slice : [startIndex, size] }
		}, 
		function (err, userArticles) {
			if (err) {
				return callback(err);
			} else {
				if (!userArticles) {
					return callback(null, []);
				} else {
					console.log('return jor');
					return callback(null, userArticles.articles);
				}
			}
		}
	);

}

userArticlesModel = mongoose.model('UserArticles', userArticlesSchema);

module.exports = {
	schema : userArticlesSchema,
	model  : userArticlesModel
}

