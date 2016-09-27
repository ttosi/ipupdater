# ipupdater

ipupdater is a useful script for computers on a LAN that have a dynamic public IPs (aka, most home ISPs). This nodejs script will monitor the external IP address and notify you via email when the address has chganged or publish the new address to an offsite node http server. In my case a VPS.

There are two configurations that it can be run in: client/server or standalone. In the client/server configuration the client pushes any IP changes to the server. The IP address is made available through a simple node webserver. For the standalone configuration, the client script monitors for IP address changes and then send an email when the new address. I use Sendgrid for the email service but it could easily be adapted to send an email any way you see fit.

## Setup


Required .env file for standalone
```bash
SENDGRID_APIKEY=<Sendgrid_API_Key>
EMAIL_TO=<Recipient>
EMAIL_SUBJECT='Home IP Address Changed'
```

sudo forever-service install --script standalone.js -e "PATH=/usr/local/bin:\$PATH" ipupdater
