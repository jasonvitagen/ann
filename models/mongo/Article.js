var mongoose = require('mongoose')
	, moment = require('moment')
	, webfrontArticleConfig = require('../../config/webfront/article')
	, mongoConfig = require('../../config/mongo')
	, articlePrePostSaveBehaviors = require('./articlePrePostSaveBehaviors');


var articleSchema = mongoose.Schema({
	articleId : String,
	created	: { 
		type    : Date, 
		default : Date.now
	},
	createdBeautified : { 
		type    : String, 
		default : moment().format(webfrontArticleConfig.view.beautifiedCreatedDateTimeFormat) 
	},
	authorId : {
		type : String,
		required : webfrontArticleConfig.save.validationMessages.articleAuthorIdRequiredMsg
	},
	authorName  : {
		type : String,
		required : webfrontArticleConfig.save.validationMessages.articleAuthorNameRequiredMsg
	},
	authorEmail : {
		type : String,
		required : webfrontArticleConfig.save.validationMessages.articleAuthorEmailRequiredMsg
	},
	title : {
		type     : String,
		required : webfrontArticleConfig.save.validationMessages.articleTitleRequiredMsg,
		validate : [
			{ validator : mongoConfig.validators.maxLength(webfrontArticleConfig.save.articleTitleAllowedLength), msg : webfrontArticleConfig.save.articleTitleLengthExceedsMsg }
		]
	},
	thumbnail : {
		type     : String,
		required : webfrontArticleConfig.save.validationMessages.articleThumbnailRequiredMsg,
		validate : [
			{ validator : mongoConfig.validators.maxLength(webfrontArticleConfig.save.articleThumbnailAllowedLength), msg : webfrontArticleConfig.save.articleThumbnailLengthExceeds },
			{ validator : mongoConfig.validators.validImagePath }
		]
	},
	category : {
		type : String,
		required : webfrontArticleConfig.save.validationMessages.articleCategoryRequiredMsg
	},
	categoryUrl : String,
	content : {
		type     : String,
		required : webfrontArticleConfig.save.validationMessages.articleContentRequiredMsg,
		validate : [
			{ validator : mongoConfig.validators.maxLength(webfrontArticleConfig.save.articleContentAllowedLength), msg : webfrontArticleConfig.save.articleContentLengthExceeds }
		]
	},
	view : {
		type    : Number,
		default : webfrontArticleConfig.save.articleViewDefaultValue
	}

});

// Define indexes
articleSchema.index({ authorId : 1 });
articleSchema.index({ articleId : 1 });
articleSchema.index({ created : 1 });
articleSchema.index({ category : 1 });

articleSchema.statics.getArticleById = function (args, callback) {

	if (!args) {
		return callback('No arguments');
	}

	this.findOne(
		{

		}
	);

}

articleSchema.statics.getUserArticles = function (args, callback) {

	if (!args) {
		return callback('No arguments');
	}

	var startIndex = args.startIndex
		, size = args.size;

	this
		.find()
		.skip(startIndex)
		.limit(size)
		.sort({ created : -1 })
		.exec(function (err, articles) {
			if (err) {
				return callback(err);
			} else {
				if (!articles) {
					return callback(null, []);
				} else {
					return callback(null, articles);
				}
			}
		});

}

articleSchema.statics.getAllArticles = function (args, callback) {

	if (!args) {
		return callback('No arguments');
	}
	if (!args.fields) {
		args.fields = '';
	}
	if (!args.query) {
		args.query = {};
	}

	var startIndex = args.startIndex
		, size = args.size;

	this
		.find(args.query)
		.select(args.fields)
		.skip(startIndex)
		.limit(size)
		.sort({ created : -1 })
		.exec(function (err, articles) {
			if (err) {
				return callback(err);
			} else {
				if (!articles) {
					return callback(null, []);
				} else {
					return callback(null, articles);
				}
			}
		});

}

articleSchema.statics.getArticlesByCategory = function (args, callback) {

	if (!args) {
		return callback('No arguments');
	}

	var startIndex = args.startIndex
		, size = args.size
		, categoryId = args.categoryId;
	
	this
		.find({ category : categoryId })
		.skip(startIndex)
		.limit(size)
		.sort({ created : -1 })
		.exec(function (err, articles) {
			if (err) {
				return callback(err);
			} else {
				if (!articles) {
					return callback(null, []);
				} else {
					return callback(null, articles);
				}
			}
		});

}

articleSchema.statics.getArticleById = function (args, callback) {

	if (!args) {
		return callback('No arguments');
	}

	var articleId = args.articleId;

	this
		.where({ articleId : articleId })
		.findOne(function (err, article) {
			if (err) {
				callback(err);
			} else {
				callback(null, article);
			}
		});

}

articleSchema.statics.deleteArticleById = function (args, callback) {

	if (!args) {
		return callback('No arguments');
	}

	var articleId = args.articleId;

	this
		.where({ articleId : articleId })
		.findOneAndRemove(function (err, article) {
			if (err) {
				callback(err);
			} else {
				callback(null, article);
			}
		});

}

articleSchema.statics.doesUserHaveArticle = function (args, callback) {

	if (!args) {
		return callback('No arguments');
	}

	var authorId = args.authorId
		, articleId = args.articleId;

	this
		.findOne()
		.where({ authorId : authorId })
		.where({ articleId : articleId })
		.exec(function (err, article) {
			if (err) {
				callback(err);
			} else {
				if (!article) {
					callback(null, false);
				} else {
					callback(null, true);
				}
			}
		});

}

var articleModel = mongoose.model('Article', articleSchema);

articlePrePostSaveBehaviors.setupPreSave(articleSchema, articleModel);
// articlePrePostSaveBehaviors.setupPostSave(articleSchema, articleModel);

module.exports = {
	schema : articleSchema,
	model  : articleModel
};