/**
 * Created by jojoldu@gmail.com on 09/06/2018
 * Blog : http://jojoldu.tistory.com
 * Github : http://github.com/jojoldu
 */

const TOKEN = process.env.TOKEN;
const JSON_URL = process.env.JSON_URL;
const https = require('https');
const util = require('util');

const commands = [
    {"path": "/start", "description":"시작 및 도움말"},
    {"path": "/list", "description":"채용 목록"},
    {"path": "/start", "description":"시작 및 도움말"},
    {"path": "/start", "description":"시작 및 도움말"}
];

exports.handler = (event, context) => {
    const requestChatId = event.message.from.id;
    const requestText = event.message.text;

    if(requestText === "/list"){
        https.request(JSON_URL, (res)=>{
            console.log(res);
            const recruits = JSON.parse(res);
            sendMessage(context, requestChatId, JSON.stringify(recruits));
        });
    } else {
        sendMessage(context, requestChatId, "없는 명령어 입니다.");
    }
};

function sendMessage(context, chatId, text) {
    const postData = {
        "chat_id": chatId,
        "text": text
    };

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

