var Imgur = new require('../../plugins/imgur/imgur')
	, imgur = new Imgur({
		clientId : 'bee3d39ff575914'
	})
	, async = require('async')
	, apis = {};

apis.uploadImagesOfCrawledArticle = function (args, callback) {

	if (!args) {
		return callback('No args');
	}
	if (!args.thumbnail) {
		return callback('No "thumbnail" arg');
	}
	if (!args.images) {
		return callback('No "images" arg');
	}
	if (!args.content) {
		return callback('No "content" arg');
	}



	async.parallel([

		function (done) {

			imgur.uploadUrl({
				imageUrl : args.thumbnail
			}, function (err, response) {

				if (err) {
					console.log(err);
				}
				if (!err
					&& !response.body.data.error) {
					args.thumbnail = response.body.data.link;
				}

				done();

			});

		},

		function (done) {

			var i = 0;

			async.each(args.images, function (img, done2) {

				imgur.uploadUrl({
					imageUrl : img
				}, function (err, response) {

					if (err) {
						console.log(err);
					}
					if (!err) {
						try {
							args.images.splice(i++, 1, response.body.data.link || '');
						} catch (ex) {
							console.log(ex);
						}
					}

					done2();

				});

			}, function (err) {

				done();

			});

		},

		function (done) {

			imgur.uploadAndReplace({
				content : args.content
			}, function (err, html) {
				args.content = html;
				done();
			});

		}

	], function (err, results) {

		if (err) {
			return callback(err);
		}
		callback(null, args);

	});

}


module.exports = apis;