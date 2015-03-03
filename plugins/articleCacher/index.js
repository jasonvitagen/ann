var redis = require('redis')
	, apis = {}
	, client = redis.createClient();

apis.cacheArticleToPool = function (args, callback) {

	if (!args) {
		return callback('No args');
	}
	if (!args.key) {
		return callback('No "key" arg');
	}
	if (!args.items) {
		return callback('No "item" arg');
	}
	if (!args.items.length) {
		return callback('Item must be an array');
	}

	var input = [args.key].concat(args.items);

	client.zadd(input, function (err, response) {
		if (err) {
			return callback(err);
		}
		return callback(null, response);
	});

}

apis.cacheArticleToPool({
	key : 'articlesPool',
	items : [200, 'Elisabeth', 300, 'Ann']
}, function (err, response) {
	if (err) {
		console.log(err);
	}
	console.log(response);
});

apis.getCachedArticlesFromPool = function (args, callback) {

	if (!args) {
		return callback('No args');
	}
	if (!args.command) {
		return callback('No "command" arg');
	}
	if (!args.key) {
		return callback('No "key" arg');
	}
	if (!args.options) {
		return callback('No "options" arg');
	}
	if (!args.options.length) {
		return callback("Options must be an array")
	}

	var input = [args.key].concat(args.options);

	try {

		client[args.command](input, function (err, response) {
			if (err) {
				return callback(err);
			}
			return callback(response);
		});
		
	} catch (ex) {
		return callback(ex);
	}

}

apis.cacheArticle = function (args, callback) {

	if (!args) {
		return callback('No args');
	}
	if (!args.key) {
		return callback('No "key" arg');
	}
	if (!args.items) {
		return callback('No "item" arg');
	}

	client.hmset(args.key, args.items, function (err, response) {
		if (err) {
			return callback(err);
		}
		return callback(null, response);
	});

}

// apis.getCachedArticlesFromPool({
// 	key : 'articlesPool',
// 	command : 'zrange',
// 	options : [0, -1]
// }, function (err, response) {
// 	if (err) {
// 		console.log(err);
// 	}
// 	console.log(response);
// });

apis.getCachedArticle = function (args, callback) {

	if (!args) {
		return callback('No args');
	}
	if (!args.key) {
		return callback('No "key" arg');
	}

	client.hgetall(args.key, function (err, response) {
		if (err) {
			return callback(err);
		}
		return callback(null, response);
	});

}


module.exports = apis;