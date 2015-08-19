var net = require('net'),
	publicIp = require('public-ip')
	currentIp = '';


setInterval(function() {
	publicIp(function (err, ip) {
		if(ip !== currentIp) {
			var client = new net.Socket();
			
			client.connect(1337, 'tdc2.turningdigital.com', function() {
				console.log('Connected...');
				console.log('Sending new ip address: ' + ip + '...');
				
				client.write(ip);
				currentIp = ip;

				client.destroy();
				console.log('Connection closed.');
			});
		}
	});
}, 30000);

console.log('Monitoring ip address.')

