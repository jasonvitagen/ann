var Article = require('../../models/redis/Article').Article;


// Route middleware to make sure user is logged in
function isLoggedIn (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash('message', 'Please login first');
	res.redirect('/');
}

// Route middleware to make sure user is not logged in
function isNotLoggedIn (req, res, next) {
	if (!req.isAuthenticated()) {
		return next();
	}
	req.flash('message', 'You are already logged in');
	res.redirect('/');
}

// Route middleware to make sure user is admin
function isAdmin (req, res, next) {
	if (req.user.role === 'admin') {
		return next();
	}
	req.flash('message', 'Only admin');
	res.redirect('/');
}

function isArticleBelongedToUser (req, res, next) {
	Article.isUserHasArticle(req.user, req.body.articleId, function (isUserHasArticle) {
		if (isUserHasArticle) {
			return next();
		} else {
			req.flash('message', 'There is an error in removing your article');
			res.redirect('/article/my-articles');
		}
	});
}

module.exports = {
	isLoggedIn : isLoggedIn,
	isNotLoggedIn : isNotLoggedIn,
	isAdmin : isAdmin,
	isArticleBelongedToUser : isArticleBelongedToUser
}