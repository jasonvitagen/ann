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
		.find({ 'authorId' : args.authorId })
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

var articleModel = mongoose.model('Article', articleSchema);

articlePrePostSaveBehaviors.setupPreSave(articleSchema, articleModel);
articlePrePostSaveBehaviors.setupPostSave(articleSchema, articleModel);

module.exports = {
	schema : articleSchema,
	model  : articleModel
};