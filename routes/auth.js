// Dependencies
var express = require('express');
var router  = express.Router();
var authMiddlewares = require('./middlewares/auth');
var rememberMeMiddlewares = require('./middlewares/remember-me');

module.exports = function (passport) {

	// Local Login
	router.get('/local-login', authMiddlewares.isNotLoggedIn, function (req, res) {
		res.render('auth/local-login', { title: 'Local Login', message: req.flash('message') });
	});

	router.post('/local-login', authMiddlewares.isNotLoggedIn, passport.authenticate('local-login', {
		failureRedirect : '/auth/local-login',
		failureFlash    : true
	}), rememberMeMiddlewares.generateTokenAndSetCookie, function (req, res) {
		res.redirect('/auth/profile');
	});

	// Local Signup
	router.get('/local-signup', authMiddlewares.isNotLoggedIn, function (req, res) {
		res.render('auth/local-signup', { title: 'Local Signup', message: req.flash('message') });
	});

	router.post('/local-signup', authMiddlewares.isNotLoggedIn, passport.authenticate('local-signup', {
		failureRedirect : '/auth/local-signup',
		failureFlash    : true
	}), rememberMeMiddlewares.generateTokenAndSetCookie, function (req, res) {
		res.redirect('/auth/profile');
	});

	// Local Connect
	router.get('/connect/local', function (req, res) {
		res.render('auth/local-connect', { title: 'Local Connect', message: req.flash('message') });
	});

	router.post('/connect/local', passport.authenticate('local-signup', {
		successRedirect : '/auth/profile',
		failureRedirect : '/',
		failureFlash    : true
	}));


	// Facebook Login
	router.get('/facebook-login', passport.authenticate('facebook', {
		scope: 'email'
	}));

	// Facebook Callback
	router.get('/facebook/callback', passport.authenticate('facebook', {
		failureRedirect: '/'
	}), rememberMeMiddlewares.generateTokenAndSetCookie, function (req, res) {
		res.redirect('/auth/profile');
	});

	// Facebook Connect
	router.get('/connect/facebook', passport.authorize('facebook', { scope: 'email' }));

	// Facebook Connect Callback
	router.get('/connect/facebook/callback', passport.authorize('facebook', {
		successRedirect: '/auth/profile',
		failureRedirect: '/'
	}));

	// Google Login
	router.get('/google-login', passport.authenticate('google', {
		scope: ['email', 'profile']
	}));

	// Google Callback
	router.get('/google/callback', passport.authenticate('google', {
		failureRedirect: '/'
	}), rememberMeMiddlewares.generateTokenAndSetCookie, function (req, res) {
		res.redirect('/auth/profile');
	});

	// Google Connect
	router.get('/connect/google', passport.authorize('google', { scope: ['email', 'profile']}));

	// Google Connect Callback
	router.get('/connect/google/callback', passport.authorize('google', {
		successRedirect: '/auth/profile',
		failureRedirect: '/'
	}));

	// UNLINK ACCOUNTS
	//----------------------------------------------------------------------------

	// Local
	router.get('/unconnect/local', function (req, res) {
		var user = req.user;
		user.local.email    = undefined;
		user.local.password = undefined;
		user.save(function (err) {
			res.redirect('/auth/profile');
		});
	});

	// Facebook
	router.get('/unconnect/facebook', function (req, res) {
		var user = req.user;
		user.facebook.token = undefined;
		user.save(function (err) {
			res.redirect('/auth/profile');
		});
	});

	// Google
	router.get('/unconnect/google', function (req, res) {
		var user = req.user;
		user.google.token = undefined;
		user.save(function (err) {
			res.redirect('/auth/profile');
		});
	});


	// Profile
	router.get('/profile', authMiddlewares.isLoggedIn, function (req, res) {
		res.render('auth/profile', { title: 'Profile', user: req.user, message : req.flash('message') });
	});

	// Logout
	router.get('/logout', function (req, res) {
		res.clearCookie('remember_me');
		req.logout();
		req.flash('message', 'You have been logged out');
		res.redirect('/');
	});

	return router;
}