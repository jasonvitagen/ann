function setup (redisClient) {

	redisClient.on('error', function (err) {
		console.log('Error: ' + err);
	});
	redisClient.on('ready', function () {
		console.log('Redis client is ready');
	});
	redisClient.on('end', function () {
		console.log('Redis has been ended');
	});
	redisClient.on('idle', function () {
		console.log('Redis is idle');
	});
	
}

module.exports = {
	setup : setup
};