var config = require('../config/webfront/article');

module.exports = function (app) {
	app.locals.viewVariables = config;
}