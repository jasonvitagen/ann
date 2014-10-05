var webFrontIndexConfig = require('../config/webfront/index');
var articleConfig = require('../config/webfront/article');


module.exports = function (app) {
	app.locals.webFront = webFrontIndexConfig;
	app.locals.viewVariables = articleConfig;
}