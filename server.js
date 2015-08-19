var net = require('net'),
	http = require('http'),
	currentIp = '';

var server = net.createServer(function (socket) {
	socket.on('data', function (data) {
		currentIp = data + '';
	});
}).listen(1337);

http.createServer(function (req, res) {
	res.writeHead(200, { 'Content-Type': 'text/plain' });
	res.end('Current IP Address: ' + currentIp);
}).listen(1338);