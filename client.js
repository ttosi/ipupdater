/*
Copyright (c) 2015, Tony S. Tosi <ttosi519@gmail.com>
Permission to use, copy, modify, and/or distribute this software
for any purpose with or without fee is hereby granted, provided
that the above copyright notice and this permission notice appear
in all copies. 

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL
WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL
THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR
CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT,
NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

var net = require('net'),
    publicIp = require('public-ip'),
    args = require("command-line-args"),
    currentIp = '';
    
var options = args([
    { name: "server", alias: "s", type: String },
    { name: "port", alias: "p", type: Number, defaultValue: 1337 },
    { name: "interval", alias: "i", type: Number, defaultValue: 5 }
]).parse();

if(!options['server']) {
    console.log('The ipupdater\'s server address required: node server.js --server, -s <server address>');
    return false;
}

setInterval(function () {
    publicIp(function (err, ip) {
        if(ip !== currentIp) {
            var client = new net.Socket();
			client.connect(options['port'], options['server'], function () {
				client.write(ip);
				currentIp = ip;

                client.destroy();
            });
        }
    });
}, options['interval'] * 60000);

