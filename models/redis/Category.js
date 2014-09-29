var config = require('../../config/redis');
var Article = require('./Article').Article;


var categories = {
	'影片' : null,
	'生活' : {
		'食物' : null,
		'心理' : null,
		'健康' : null,
		'时尚' : null,
		'爱情' : null
	},
	'娱乐' : null,
	'爆笑' : null,
	'感动' : null,
	'动物' : null,
	'惊奇' : {
		'地球' : null,
		'社会' : null,
		'历史' : null
	},
	'艺术' : {
		'建筑' : null,
		'设计' : null,
		'摄影' : null
	},
	'表演' : {
		'音乐' : null,
		'跳舞' : null
	},
	'新闻' : null,
	'旅游' : null,
	'女性专区' : null
}

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
		Article.getArticlesByIdList(idList, function (articles) {
			console.log(articles);
			callback(articles);
		});
	});
}

module.exports = {
	categories : categories,
	setup : setup,
	Category : Category
}