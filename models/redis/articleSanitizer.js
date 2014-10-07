var webfrontArticleConfig = require('../../config/webfront/article');

module.exports = function (articleData) {

	articleData.content = articleData.content.replace('<script>', '');

	if (articleData.content.length > 1500) {
		articleData.content = articleData.content.substring(0, webfrontArticleConfig.maxArticleContentLength);
	}

	return articleData;

}