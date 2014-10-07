var config = require('../../config/redis');
var Article = require('./Article').Article;


var client = null;

function setup (redisClient) {
	client = redisClient;
	return Category;
}

function Category () {

}

Category.getArticlesByCategory = function (categoryId, number, size, callback) {
	var categoryArticlesId = config.keyNames.category.articles.getId(categoryId);
	var startIndex = number * size;
	var endIndex = startIndex + size - 1;
	client.zrange([categoryArticlesId, startIndex, endIndex], function (err, idList) {
		Article.getArticlesByIdList(idList, function (err, articles) {
			if (err) {
				callback(err);
			} else {
				callback(null, articles);
			}
		});
	});
}

module.exports = {
	setup : setup,
	Category : Category
}