/**
 * Created by jojoldu@gmail.com on 09/06/2018
 * Blog : http://jojoldu.tistory.com
 * Github : http://github.com/jojoldu
 */

const TOKEN = process.env.TOKEN;
const JSON_URL = process.env.JSON_URL;
const https = require('https');
const util = require('util');
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

const commands = [
    {"path": "/start", "description":"시작 및 도움말"},
    {"path": "/recruits", "description":"현재 채용 목록"},
    {"path": "/github", "description":"저장소 Github Link"},
    {"path": "/facebook", "description":"페이스북 Link"},
];

exports.handler = (event, context) => {
    console.log(JSON.stringify(event));
    const requestChatId = event.message.chat.id;
    const requestText = event.message.text;

    if(requestText === "/start" || requestText === "/start@devbeginner_bot") {
        const intro = "초보개발자모임 Bot Commands\n";
        const message = commands.map( c => c.path +" - " + c.description).join("\n");
        sendMessage(context, requestChatId, intro+message);
    } else if(requestText === "/recruits"|| requestText === "/recruits@devbeginner_bot") {
        https.get(JSON_URL, (res) => {
            res.on('data', (d) => {
                const strJson = decoder.write(d);
                sendMessage(context, requestChatId, toMessage(JSON.parse(strJson).recruits));
            });
        });
    } else if(requestText === "/github"|| requestText === "/github@devbeginner_bot"){
        sendMessage(context, requestChatId, "http://bit.ly/2JpiOs7");
    } else if(requestText === "/facebook"|| requestText === "/facebook@devbeginner_bot"){
        sendMessage(context, requestChatId, "http://bit.ly/2HBXkSW");
    } else {
        console.log("없는 명령어 입니다. "+ requestText);
    }
};

function toMessage(recruits) {
    return recruits
        .map( (r) => "[" + r.endDate + "] " +r.description + " ("+r.link+")")
        .join("\n")
}
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

