module.exports = function (articleData) {

	articleData.content = articleData.content.replace('<script>', '');

	return articleData;

}