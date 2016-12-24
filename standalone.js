/*
MIT License
Copyright (c) 2016, Tony S. Tosi <ttosi519@gmail.com>
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

require('dotenv').config();

var net = require('net'),
    publicIp = require('public-ip'),
    args = require('command-line-args'),
    moment = require('moment'),
    log = require('log4js').getLogger(),
    ip = require('ip');

var sendGrid = require('sendgrid')(process.env.SENDGRID_APIKEY),
    sendGridHelper = require('sendgrid').mail,
    email = new sendGridHelper.Email(process.env.EMAIL_TO),
    subject = process.env.EMAIL_SUBJECT;

var currentIp = '';
var networkIp = ip.address();

var options =
    args([
      {name: 'interval', alias : 'i', type: Number, defaultValue: 5}
    ]).parse();

log.info('starting ipupdater');
log.info(options);

function checkIp() {
  publicIp(function(err, ip) {
    if (err) {
      log.error(err);
      return;
    }

    if (ip !== currentIp) {
      var timestamp = moment(new Date()).format('MM-DD-YYYY hh:mm A');
      var formattedIp = ip + ' (updated ' + timestamp + ')';

      var content = new sendGridHelper.Content('text/html',
        'External Address: ' + formattedIp + '<br />LAN Address: ' + networkIp);
      var mail = new sendGridHelper.Mail(email, subject, email, content);

      var request = sendGrid.emptyRequest(
          {method : 'POST', path : '/v3/mail/send', body : mail.toJSON()});

      sendGrid.API(request, function(error, response) {
        currentIp = ip;
        log.info('IP address changed: ' + currentIp);
      });
    }
  });
}

setInterval(checkIp, options['interval'] * 60000);

checkIp();
