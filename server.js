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

require('dotenv').config()
var net = require('net'),
    http = require('http'),
    args = require('command-line-args'),
    moment = require('moment');
	
var	formattedIp = 'Initializing',
	currentIp = '';
	
var sendGrid = require('sendgrid')(process.env.SENDGRID_APIKEY),
	sendGridHelper = require('sendgrid').mail,
	email = new sendGridHelper.Email(process.env.EMAIL_TO),
	subject = process.env.EMAIL_SUBJECT;
    
var options = args([
    { name: 'tcp-port', alias: 't', type: Number, defaultValue: 1337 },
    { name: 'http-port', alias: 'h', type: Number, defaultValue: 1338 },
]).parse();

var server = net.createServer(function (socket) {
    socket.on('data', function (data) {
        var timestamp = moment(new Date()).format('MM-DD-YYYY hh:mm:ss A');
		formattedIp = data + ' (updated ' + timestamp + ')';
		
		console.log('formattedIp (socket): ' + formattedIp);
		
		if(data !== currentIp) {
			var content = new sendGridHelper.Content('text/plain', 'New IP Address: ' + formattedIp);
			var mail = new sendGridHelper.Mail(email, subject, email, content);
			
			var request = sendGrid.emptyRequest({
				method: 'POST',
				path: '/v3/mail/send',
				body: mail.toJSON()
			});

			sendGrid.API(request, function(error, response) {
				currentIp = data;
			});
		}
		
    });
}).listen(options['tcp-port']);

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Current IP Address: ' + formattedIp);
	
	console.log('formattedIp (http): ' + formattedIp);
}).listen(options['http-port']);

