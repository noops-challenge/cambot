## To run the starter:

Create a certificate:
`openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem`

Install `npx` (or if you'd prefer, `npm instal http-server`)

Then run:

`npx http-server -S`