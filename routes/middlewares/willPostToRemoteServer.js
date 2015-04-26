var request = require('request')
	, middlewares = {};

middlewares.willPostToServer = function (req, res, next) {

	if (!req.body.willPostToServer) {
		return next();
	}

	req.body.willPostToServer = false;

	var j = request.jar();
	var cookie = request.cookie('Authentication=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoicWlzaGVuLmNoZW5nIiwic2NvcGVzIjpbImFwcHJvdmVDcmF3bGVkQXJ0aWNsZSIsImNhbkVkaXREZWxldGVBcnRpY2xlIiwiY2FuQWNjZXNzQ29udHJvbFBhbmVsIl0sImlhdCI6MTQyNzYzOTM3N30.HG3RjjRVUeb5JkyRJ0f0hbjVRfRgkQx76Q1XRW_MqoE');
	j.setCookie(cookie, req.body.remoteServer.match(/(http:\/\/.+?)\//)[1]);

	request.post({
		url : req.body.remoteServer,
		jar : j,
		form : {
			title : req.body.title,
			thumbnail : req.body.thumbnail,
			category : req.body.category,
			content : req.body.content
		}
	}, function (err, response, body) {

		if (!err && response.statusCode == 200) {
			body = JSON.parse(body);
			if (body.err) {
				res.status.send(body.err);
			} else {
				res.json({
					status : 'ok'
				});
			}
		} else {
			res.status(500).send(err);
		}

	});


}

module.exports = middlewares;