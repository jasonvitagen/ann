var express = require('express')
    , router = express.Router()
    , Article = require('../models/redis/Article').Article
    , webFrontIndexConfig = require('../config/webfront/index')
    , indexRoutesBehaviors = require('./indexRoutesBehaviors');

/* GET home page.(Archived) */
// router.get('/', function(req, res) {
//   indexRoutesBehaviors.get.index.v2(req, res);
// });

router.get('/', function (req, res) {
  res.render('index', {
    facebookShare : {
      pageUrl : 'http://jiaowojiejie.com',
      pageTitle : '叫我姐姐',
      pageDescription : '一款超简单信息量超大的实用趣味新闻游览器',
      pageThumbnail : '/images/screen.png'
    }
  });
});

router.post('/angularjs-order-test', function (req, res) {
	console.log(req.body);
	res.json({
		status : 'ok'
	});
});

router.get('/more/:number', function (req, res) {
  indexRoutesBehaviors.get.indexMore.v2(req, res);
});

module.exports = router;
