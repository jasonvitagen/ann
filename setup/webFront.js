var webFrontIndexConfig = require('../config/webfront/index'),
	articleConfig = require('../config/webfront/article'),
	categoriesTranslator = require('../helpers/categoriesTranslator');



module.exports = function (app) {
	app.locals.webFront = webFrontIndexConfig;
	app.locals.viewVariables = articleConfig;
	app.locals.categoriesTranslator = categoriesTranslator;
}