var express = require('express')
    , router = express.Router()
    , Article = require('../models/redis/Article').Article
    , webFrontIndexConfig = require('../config/webfront/index')
    , indexRoutesBehaviors = require('./indexRoutesBehaviors');

/* GET home page. */
router.get('/', function(req, res) {
  indexRoutesBehaviors.get.index.v2(req, res);
});

router.get('/more/:number', function (req, res) {
  indexRoutesBehaviors.get.indexMore.v2(req, res);
});

module.exports = router;
