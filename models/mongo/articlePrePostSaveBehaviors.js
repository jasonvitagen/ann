var webfrontConfig = require('../../config/webfront/index')
	, categoryArticles = require('./CategoryArticles').model
	, userArticles = require('./UserArticles').model;

function setupPreSave (schema) {

	schema.pre('save', function (next) {
		this.categoryUrl = '/' + webfrontConfig.categoryBaseUrlName + '/' + this.category.replace(':', '/');
		next();
	});

}

function setupPostSave (schema) {

	schema.post('save', function (doc) {
		categoryArticles.addArticleToRelatedCategory(doc);
	});

	schema.post('save', function (doc) {
		userArticles.addArticleToRelatedUser(doc);
	});

}

module.exports = {
	setupPreSave : setupPreSave,
	setupPostSave : setupPostSave
}