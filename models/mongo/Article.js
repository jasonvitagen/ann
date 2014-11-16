var mongoose = require('mongoose')
	, moment = require('moment')
	, categorySchema = require('./Category').schema
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
		type : String
	},
	authorEmail : String,
	title : {
		type     : String,
		validate : [
			{ validator : mongoConfig.validators.maxLength(webfrontArticleConfig.save.articleTitleAllowedLength), msg : webfrontArticleConfig.save.articleTitleLengthExceedsMsg }
		]
	},
	thumbnail : {
		type     : String,
		validate : [
			{ validator : mongoConfig.validators.maxLength(webfrontArticleConfig.save.articleThumbnailAllowedLength), msg : webfrontArticleConfig.save.articleThumbnailLengthExceeds }
		]
	},
	category : String,
	categoryUrl : String,
	content : {
		type     : String,
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