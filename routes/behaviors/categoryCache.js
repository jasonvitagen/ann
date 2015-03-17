var ArticleModel = require('../../models/mongo/Article').model
	, client = require('redis').createClient()
	, async = require('async')
	, apis = {};

apis.updateCategoryCache = function (args, callback) {

	ArticleModel
		.distinct('category', function (err, response) {
		
			async.each(response, function (item, done) {

				client.sadd(['categories', item], function (err) {
					done();
				});

			}, function (err) {

				callback();

			});
		});
		
}

apis.getCategoryCache = function (args, callback) {

	client.smembers('categories', function (err, response) {
		if (err) {
			return callback(err);
		}
		return callback(null, response);
	});

}

module.exports = apis;