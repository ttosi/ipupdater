# ipupdater

ipupdater is useful when you have a server or a home computer that lives on a internet connection where the public IP address can change. Most consumer ISPs use dynamic IPs and charge additional fees for a static one. This application will monitor the home's IP address and notify you via email when the address has chganged.

## Install

.env file
```bash
NODE_ENV=dev
SENDGRID_APIKEY=<Sendgrid_API_Key>
EMAIL_TO=<Recipient>
EMAIL_SUBJECT='Home IP Address Changed'
```
