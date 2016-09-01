# ipupdater

ipupdater is useful when you have a server or a home computer that lives on an internet connection where the public IP is dynamic IPs. This application will monitor the home's IP address and notify you via email when the address has chganged.

There are two configurations ipudater can be run in: client/server or standalone. In the client/server configuration the client pushes any IP changes to the server. The IP address is made available through a simple node webserver. For the standalone configuration, the client script monitors for IP address changes and send an email when the address has changed. I use Sendgrid but it could easily be adapted to send an email in any fashion.

## Setup


.env file for standalone
```bash
SENDGRID_APIKEY=<Sendgrid_API_Key>
EMAIL_TO=<Recipient>
EMAIL_SUBJECT='Home IP Address Changed'
```
