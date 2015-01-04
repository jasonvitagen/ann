var express = require('express')
	, router = express.Router();

router.post('/get-crawled-articles', function (req, res) {
	console.log(req.body);
});

module.exports = router;