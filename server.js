/*
Copyright (c) 2015, Tony S. Tosi <ttosi519@gmail.com>
Permission to use, copy, modify, and/or distribute this software
for any purpose with or without fee is hereby granted, provided
that the above copyright notice and this permission notice appear
in all copies. 

THE SOFTWARE IS PROVIDED 'AS IS' AND THE AUTHOR DISCLAIMS ALL
WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL
THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR
CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT,
NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

var net = require('net'),
    http = require('http'),
    args = require('command-line-args'),
	moment = require('moment'),
    currentIp = '';
    
var options = args([
    { name: 'tcp-port', alias: 't', type: Number, defaultValue: 1337 },
    { name: 'http-port', alias: 'h', type: Number, defaultValue: 1338 },
]).parse();

var server = net.createServer(function (socket) {
    socket.on('data', function (data) {
        var timestamp = moment(new Date()).format('MM-DD-YYYY hh:mm:ss A');
		currentIp = data + ' (updated ' + timestamp + ')';
    });
}).listen(options['tcp-port']);

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Current IP Address: ' + currentIp);
}).listen(options['http-port']);