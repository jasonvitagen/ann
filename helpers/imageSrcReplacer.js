var cheerio = require('cheerio')
	, Imgur = require('../plugins/imgur')
	, imgur = new Imgur({
		clientId : 'fe831b31baf537f'
	})
	, async = require('async')
	, imgSrcReplacer = {};

imgSrcReplacer.uploadAndReplaceAll = function (args, callback) {

	if (!args) {
		return callback('No args');
	}
	if (!args.content) {
		return callback('No "content" arg');
	}

	var $ = cheerio.load(args.content)
		, imgs = $('img').toArray();

	console.log(imgs);

	callback(null);

}

module.exports = imgSrcReplacer;

