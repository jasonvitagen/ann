var mongoose = require('mongoose')
	, moment = require('moment')
	, webfrontArticleConfig = require('../../config/webfront/article')
	, mongoConfig = require('../../config/mongo')
	, articlePrePostSaveBehaviors = require('./articlePrePostSaveBehaviors');


var articleSchema = mongoose.Schema({

	created	: { 
		type    : Date, 
		default : Date.now
	},
	createdBeautified : { 
		type    : String, 
		default : moment().format(webfrontArticleConfig.view.beautifiedCreatedDateTimeFormat) 
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
			{ validator : mongoConfig.validators.maxLength(webfrontArticleConfig.save.articleThumbnailAllowedLength), msg : webfrontArticleConfig.save.articleThumbnailLengthExceeds }
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

articlePrePostSaveBehaviors.setupPreSave(articleSchema);
articlePrePostSaveBehaviors.setupPostSave(articleSchema);

module.exports = {
	schema : articleSchema,
	model  : mongoose.model('Article', articleSchema)
};