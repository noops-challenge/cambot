## To run the starter:

In order to access `getUserMedia()` you need to run your code from `https`. 

Don't worry, you can get started in three steps:

1. Create a certificate:
`openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem`

2. Install `npm install -g npx`

3. Run `npx http-server -S`

✨ Your site should now be available at `https://127.0.0.1:8081/`

(In some browsers you may get a warning about "Unsafe site" because this certificate is self signed; click "advanced" and then "Accept Risk/Continue") 
