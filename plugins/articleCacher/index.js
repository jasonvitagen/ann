var redis = require('redis')
	, apis = {}
	, client = redis.createClient()
	, Lazy = require('lazy.js')
	, async = require('async');

apis.cacheArticleToPool = function (args, callback) {

	if (!args) {
		return callback('No args');
	}
	if (!args.command) {
		return callback('No "command" arg');
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

	try {

		client[args.command](input, function (err, response) {
			if (err) {
				return callback(err);
			}
			return callback(null, response);
		});

	} catch (ex) {
		return callback(ex);
	}

}

// apis.cacheArticleToPool({
// 	command : 'zadd',
// 	key : 'articlesPool',
// 	items : [200, 'Elisabeth', 300, 'Ann']
// }, function (err, response) {
// 	if (err) {
// 		console.log(err);
// 	}
// });

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
			return callback(null, response);
		});
		
	} catch (ex) {
		return callback(ex);
	}

}

apis.trimCachedArticlesInPool = function (args, callback) {

	if (!args) {
		return callback('No args');
	}
	if (!args.key) {
		return callback('No "key" arg');
	}
	if (!args.trimSize) {
		return callback('No "trim size" arg');
	}

	client.zrange([args.key, args.trimSize, -1], function (err, response) {
		if (err) {
			return callback(err);
		}

		async.each(response, function (item, done) {

			Lazy(item)
				.split('||')
				.take(1)
				.each(function (id) {
					client.del('article:' + id, function (err, response) {
						if (err) {
							return done(err);
						}
						return done();
					});
				});

		}, function (err) {

			if (err) {
				return callback(err);
			}
			
			client.zremrangebyrank([args.key, args.trimSize, -1], function (err, response) {
				if (err) {
					return callback(err);
				}
				return callback(null, response);
			});

		});

	});

}

apis.cacheArticle = function (args, callback) {

	if (!args) {
		return callback('No args');
	}
	if (!args.key) {
		return callback('No "key" arg');
	}
	if (!args.items) {
		return callback('No "items" arg');
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

apis.removeArticleFromCachedPool = function (args, callback) {

	if (!args) {
		return callback('No args');
	}
	if (!args.key) {
		return callback('No "key" arg');
	}
	if (!args.articleId) {
		return callback('No "articleId" arg');
	}

	client.zremrangebyscore([args.key, args.articleId, args.articleId], function (err, response) {
		if (err) {
			return callback(err);
		}
		return callback(null, response);
	});

}

apis.removeArticleFromCache = function (args, callback) {

	if (!args) {
		return callback('No args');
	}
	if (!args.key) {
		return callback('No "key" arg');
	}

	client.del([args.key], function (err, response) {
		if (err) {
			return callback(err);
		}
		return callback(response);
	});

}

apis.getRandomCachedArticles = function (args, callback) {

	if (!args) {
		return callback('No args');
	}
	if (!args.key) {
		return callback('No "key" arg');
	}
	if (!args.number) {
		return callback('No "number" arg');
	}



}


module.exports = apis;