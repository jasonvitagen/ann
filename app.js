var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var currentPageUrl = require('./middlewares/currentPageUrl');

var routes = require('./routes/index');
var users = require('./routes/users');
var categoryRoutes = require('./routes/category');
var articleRoutes = require('./routes/article');
var adminRoutes = require('./routes/admin');
var crawledRoutes = require('./routes/crawled');

// require ejs dependencies
var engine = require('ejs').__express;

// require redis dependencies
var redis = require('redis');

// require passport dependencies
// var session  = require('cookie-session');
// var passport = require('passport');
// var flash    = require('connect-flash');

var mongoose = require('mongoose');

var app = express();
app.set('trust proxy', true);

var fs = require('fs');
var jwt = require('jsonwebtoken');
var secret = require('./config/auth');
var token = jwt.sign({ 
        user: 'qishen.cheng',
        scopes: ['approveCrawledArticle', 'canEditDeleteArticle', 'canAccessControlPanel']
    }, secret.secretKey1);

// fs.writeFileSync('token.txt', token);

// view engine setup
app.set('views', path.join(__dirname, 'views'));

// setup ejs
app.set('view engine', 'ejs');
app.engine('ejs', engine);

// setup redis
var redisClient = redis.createClient();
require('./setup/redisClient').setup(redisClient);

// setup models
var Article = require('./models/redis/Article').setup(redisClient);
var Category = require('./models/redis/Category').setup(redisClient);

// setup passport
// require('./setup/passport.js')(passport);
// var authRoutes = require('./routes/auth.js')(passport);

mongoose.connect('mongodb://localhost:27017/ann');

// setup webfront variables
require('./setup/webFront.js')(app);;

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json({ limit : '5mb' }));
app.use(bodyParser.urlencoded({ limit : '5mb', extended : true }));
app.use(cookieParser());
app.use(currentPageUrl());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// setup passport middlewares
// app.use(session({secret : 'iLoveAnn'}));
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(passport.authenticate('remember-me'));
// app.use(flash());

app.use('/', routes);
app.use('/users', users);

// Setup passport route
// app.use('/auth', authRoutes);
// setup category route
app.use('/category', categoryRoutes);
// setup article route
app.use('/article', articleRoutes);
// setup admin route
app.use('/admin', adminRoutes);
// setup crawled article route
app.use('/crawled', crawledRoutes);


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    console.log('bye');
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
