var config = require('./config')
	, request = require('request')
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

module.exports = Imgur;