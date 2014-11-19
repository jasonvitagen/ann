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

articleSchema.statics.getArticleById = function (args, callback) {

	if (!args) {
		return callback('No arguments');
	}

	this.findOne(
		{

		}
	);

}

module.exports = {
	schema : articleSchema,
	model  : mongoose.model('Article', articleSchema)
};