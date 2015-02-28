var config = require('./config')
	, request = require('request')
	, cheerio = require('cheerio')
	, async   = require('async')
	, Imgur;

Imgur = function (args) { // Constructor

	if (!args) {
		throw 'No arguments';
	}
	if (!args.clientId) {
		throw 'No Imgur client id';
	}

	// fields
	this.clientId = config.clientIdPrefix + args.clientId;

}


Imgur.prototype.uploadUrl = function (args, callback) {

	if (!args) {
		return callback('No arguments');
	}
	if (!args.imageUrl) {
		return callback('No image url');
	}

	request.post({
		url : config.imgurApis.v3.image_upload.route,
		headers : {
			Authorization : this.clientId
		},
		form : {
			image : args.imageUrl
		}
	}, function (err, response, body) {
		if (err) {
			return callback(err);
		} else {
			return callback(null, {
				response : response,
				body     : JSON.parse(body)
			});
		}
	});

}

Imgur.prototype.uploadAndReplace = function (args, callback) {

	if (!args) {
		return callback('No args');
	}
	if (!args.content) {
		return callback('No "content" arg');
	}

	var $ = cheerio.load(args.content)
		, imgs = $('img').toArray()
		, obj  = this;

	async.each(imgs, function (img, done) {

		obj.uploadUrl({
			imageUrl : img.attribs.src
		}, function (err, response) {

			if (!err) {

				$('img[src="' + img.attribs.src + '"]').attr('src', response.body.data.link);

			}

			done();

		});

	}, function (err) {

		if (err) {
			return callback(err);
		}
		
		return callback(null, $.html());

	});

}

module.exports = Imgur;