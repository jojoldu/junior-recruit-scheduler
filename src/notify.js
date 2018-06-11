/**
 * Created by jojoldu@gmail.com on 09/06/2018
 * Blog : http://jojoldu.tistory.com
 * Github : http://github.com/jojoldu
 */

const TOKEN = process.env.TOKEN;
const TABLE_NAME = process.env.TABLE_NAME;

const https = require('https');
const util = require('util');
const AWS = require('aws-sdk'),
    docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context) => {
    console.log(JSON.stringify(event));
    const requestChatId = event.message["chat_id"];
    const requestText = event.message.text;
    const payload = {
        TableName: TABLE_NAME,
    };

    if(requestChatId){
        const postData = {
            "chat_id": requestChatId,
            "text": requestText
        };
        sendMessage(context, postData);
    } else {
        docClient.scan(payload, (err, data)=> {
            if(err){
                throw err;
            }
            console.log("총 발송인원: "+data.Items.length);
            console.log(JSON.stringify(data.Items));

            data.Items.forEach(subscriber => {
                const postData = {
                    "chat_id": subscriber['chat_id'],
                    "text": requestText
                };
                sendMessage(context, postData);
            });
        });

    }
};

function sendMessage(context, postData) {
    const options = {
        method: 'POST',
        hostname: 'api.telegram.org',
        port: 443,
        headers: {"Content-Type": "application/json"},
        path: "/bot" + TOKEN + "/sendMessage"
    };

    const req = https.request(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            context.done(null);
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    req.write(util.format("%j", postData));
    req.end();
}

