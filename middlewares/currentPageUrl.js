module.exports = function () {

	return function (req, res, next) {

		req.currentPageUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
		next();
		
	}

}