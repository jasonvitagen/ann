var jwt = require('jsonwebtoken')
	, secret = require('../../config/auth').secretKey1
	, middlewares = {};


middlewares.canApproveCrawledArticle = function (req, res, next) {

	if (!req.cookies.Authentication) {
		return next('Not allowed');
	}

	jwt.verify(req.cookies.Authentication, secret, function (err, decoded) {
		console.log(err, decoded);
		if (err) {
			return next('Wrong authorization');
		}

		if (!decoded.scopes) {
			return next('No "scopes" arg');
		}

		if (decoded.scopes.indexOf('approveCrawledArticle') > -1) {
			next();
		}

	});

}


module.exports = middlewares;
