var webfrontConfig = require('../../config/webfront/index');

function setupPreSave (schema) {

	schema.pre('save', function (next) {
		this.categoryUrl = '/' + webfrontConfig.categoryBaseUrlName + '/' + this.category.replace(':', '/');
		next();
	});

}

function setupPostSave (schema) {

}

module.exports = {
	setupPreSave : setupPreSave,
	setupPostSave : setupPostSave
}