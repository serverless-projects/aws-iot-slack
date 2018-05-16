# aws-iot-slack
Connect an AWS IoT Button to a Slack Channel

This lambda function is used by [Tutorial — Amazon IoT Slack Button](https://blog.glassboard.com/tutorial-aws-iot-lunchtime-slack-button-295d78f4a9a6). I adjust and use environment variables more than hard coding them in lambda functions.

```
const encrypted = process.env['slack_token'];
const public_channel = process.env['public_channel'];
const private_channel = process.env['private_channel'];
const button_serial = process.env['button_serial'];
const bot_name = process.env['bot_name'];
```
