var webfrontConfig = require('../../config/webfront/index')
	, categoryArticles = require('./CategoryArticles').model;

function setupPreSave (schema) {

	schema.pre('save', function (next) {
		this.categoryUrl = '/' + webfrontConfig.categoryBaseUrlName + '/' + this.category.replace(':', '/');
		next();
	});

}

function setupPostSave (schema) {

	schema.post('save', function (doc) {
		categoryArticles
			.findOne({ name : doc.category })
			.exec(function (err, category) {
				if (err) return;
				if (category) {
					category.articles.push(doc);
					category.save(function (err) {
						if (err) return;
					})
				} else {
					var category = new categoryArticles({
						name : doc.category
					});
					category.articles.push(doc);
					category.save(function (err) {
						if (err) return;
					})
				}
				
			});
	});

}

module.exports = {
	setupPreSave : setupPreSave,
	setupPostSave : setupPostSave
}