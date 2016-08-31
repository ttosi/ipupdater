var helper = require('sendgrid').mail;

var email = new helper.Email('ttosi519@gmail.com');
var subject = 'IP Address Changed';
var content = new helper.Content('text/plain', 'New IP Address: 192.168.1.1');

var mail = new helper.Mail(email, subject, email, content);

var sg = require('sendgrid')('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');

var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
});

sg.API(request, function(error, response) {
    console.log(response.statusCode)
    console.log(response.body)
    console.log(response.headers)
})
