const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        body: 'Hello from Twilio',
        from: '+18773523740',
        to: '+18039159722'
    })
    .then((message: { sid: any; }) => console.log(message.sid))
    .done();