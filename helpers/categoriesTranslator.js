var indexConfig = require('../config/webfront/index'),
	categoriesConfig = require('../config/webfront/categories2'),
	categoriesLanguage = indexConfig.categoriesLanguage,
	categoriesTranslation = categoriesConfig.categoriesTranslations[categoriesLanguage];

function translate (word) {
	return categoriesTranslation[word];
}

module.exports = {
	translate : translate
}