// User model
var User = require('../../models/mongo/User');

var utils = require('utils');


// Middleware to set generate token and remember_me cookie
function generateTokenAndSetCookie (req, res, next) {
	var token = utils.randomString(64);
	User.findByIdAndUpdate(req.user.id, {$set : { rememberMeToken : token }}, function (err) {
		if (err) {
			return next(err);
		}
		res.cookie('remember_me', token, { path : '/', httpOnly : true, maxAge : 64880000 });
		return next();
	});
}

module.exports = {
	generateTokenAndSetCookie : generateTokenAndSetCookie
}