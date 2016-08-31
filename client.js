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
    publicIp = require('public-ip'),
    args = require('command-line-args'),
    log = require('log4js').getLogger();

var currentIp = '';

var options = args([{
    name: 'port',
    alias: 'p',
    type: Number,
    defaultValue: 1337
}, {
    name: 'interval',
    alias: 'i',
    type: Number,
    defaultValue: 5
}]).parse();

log.info('starting ipupdater');
log.info(options);

function checkIp() {
    publicIp(function(err, ip) {
        if (err) {
            log.error(err);
            return;
        }

        if (ip !== currentIp) {
            log.info('new ip detected');

            var client = new net.Socket();

            client.connect(options['port'], process.env.SERVER_ADDRESS, function() {
                currentIp = ip;
                client.write(currentIp);
                client.destroy();

                log.info('sent new ip: ' + currentIp);
            });

            client.on('error', function(err) {
                log.error('' + err);
                client.destroy();
            });
        }
    });
}

setInterval(checkIp, options['interval'] * 60000);

checkIp();
