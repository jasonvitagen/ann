var jwt = require('jsonwebtoken')
	, secret = require('../../config/auth').secretKey1
	, middlewares = {};


middlewares.canApproveCrawledArticle = function (req, res, next) {

	if (!req.cookies.Authentication) {
		return res.status(500).send('Not allowed');
	}

	jwt.verify(req.cookies.Authentication, secret, function (err, decoded) {

		if (err
			|| !decoded.scopes
			|| ! (decoded.scopes.indexOf('approveCrawledArticle') > -1)) {
			return res.status(500).send('Not allowed');
		}

		req.decoded = decoded;

		next();

	});

}

middlewares.canEditDeleteArticle = function (req, res, next) {

	if (!req.cookies.Authentication) {
		return res.status(500).send('Not allowed');
	}

	jwt.verify(req.cookies.Authentication, secret, function (err, decoded) {

		if (err
			|| !decoded.scopes
			|| ! (decoded.scopes.indexOf('canEditDeleteArticle') > -1)) {
			return res.status(500).send('Not allowed');
		}

		req.decoded = decoded;

		next();

	});

}

middlewares.canAccessControlPanel = function (req, res, next) {

	if (!req.cookies.Authentication) {
		return res.status(500).send('Not allowed');
	}

	jwt.verify(req.cookies.Authentication, secret, function(err, decoded) {

		if (err
			|| !decoded.scopes
			|| ! (decoded.scopes.indexOf('canAccessControlPanel') > -1)) {
			return res.status(500).send('Not allowed');
		}

		req.decoded = decoded;

		next();

	});

}

module.exports = middlewares;

