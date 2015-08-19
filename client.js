var net = require('net'),
	publicIp = require('public-ip')
	currentIp = '';

setInterval(function() {
	publicIp(function (err, ip) {
		if(ip !== currentIp) {
			var client = new net.Socket();
			
			client.connect(1337, 'tdc2.turningdigital.com', function() {
				client.write(ip);
				currentIp = ip;

				client.destroy();
			});
		}
	});
}, 30000);

