## Get Started:
Create a certificate:

Prereq: install `npx` (or if you'd prefer, `npm instal http-server`)

`openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem`

`npx http-server -S`