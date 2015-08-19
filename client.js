var net = require('net'),
	publicIp = require('public-ip'),
	args = require("command-line-args"),
	currentIp = '';
	
var options = args([
	{ name: "server", alias: "s", type: String },
	{ name: "port", alias: "p", type: Number, defaultValue: 1337 },
	{ name: "interval", alias: "i", type: Number, defaultValue: 300000 }
]).parse();

if(!options.server) {
	console.log('ipupdater server address required: --server, -s <server address>');
	return false;
}

setInterval(function() {
	publicIp(function (err, ip) {
		if(ip !== currentIp) {
			var client = new net.Socket();
			client.connect(options.port, options.server, function() {
				client.write(ip);
				currentIp = ip;

				client.destroy();
			});
		}
	});
}, options.interval);

