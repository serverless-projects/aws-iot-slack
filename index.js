"use strict";
const Slackbot = require('slackbots');
const AWS = require('aws-sdk');

const encrypted = process.env['slack_token'];
const public_channel = process.env['public_channel'];
const private_channel = process.env['private_channel'];
const button_serial = process.env['button_serial'];
const bot_name = process.env['bot_name'];
let decrypted;

//List the name of the group you want the notficiations posted to
//var channel = 'general';

//For each button list the name of the user and their IoT button serial number found on the back of the device
var buttonSerial = {
    Carl: button_serial
};

//I highly suggest using encrypted env variables so you don't expose your slack api token
exports.handler = (event, context, callback) => {
    if (decrypted) {
        processEvent(event, context, callback);
    } else {
        // Decrypt code should run once and variables stored outside of the function
        // handler so that these are decrypted once per container
        const kms = new AWS.KMS();
        kms.decrypt({
            CiphertextBlob: new Buffer(encrypted, 'base64')
        }, (err, data) => {
            if (err) {
                console.log('Decrypt error:', err);
                return callback(err);
            }
            decrypted = data.Plaintext.toString('ascii');
            processEvent(event, context, callback);
        });
    }
};

function processEvent(event, context, callback) {
    var edwin = new Slackbot({
        token: decrypted, //your decrypted slack token will be used here
        name: bot_name
    });
    console.log('Received event:', event);
    const payload = JSON.stringify(event);
    switch (event.serialNumber) {
        case buttonSerial.Carl:
            switch (event.clickType) {
                case "SINGLE":
                    edwin.postMessageToChannel(public_channel, "", {
                        as_user: 'true',
                        attachments: [{
                            title: "Carl is ready for lunch!",
                            fallback: "Lunchtime Alert | IoT Button",
                            text: "Lunchtime Alert | IoT Button",
                            image_url: "http://i.giphy.com/uaqCQRIqijurS.gif",
                            color: "#FFEE44"
                        }]
                    }).then(function(data) {
                        context.done(null, data);
                    });
                    break;
                case "DOUBLE":
                    edwin.postMessageToGroup(private_channel, "", {
                        as_user: 'true',
                        attachments: [{
                            title: "Carl packed his lunch today :(",
                            fallback: "Lunchtime Alert | IoT Button",
                            text: "Lunchtime Alert | IoT Button",
                            image_url: "http://i.giphy.com/RQDpP43xsuREc.gif",
                            color: "#FFEE44"
                        }]
                    }).then(function(data) {
                        context.done(null, data);
                    });
                    break;
            }
            break;
    }
}