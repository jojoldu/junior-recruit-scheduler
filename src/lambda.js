/**
 * Created by jojoldu@gmail.com on 09/06/2018
 * Blog : http://jojoldu.tistory.com
 * Github : http://github.com/jojoldu
 */

const TOKEN = process.env.TOKEN;
const JSON_URL = process.env.JSON_URL;
const TABLE_NAME = process.env.TABLE_NAME;

const https = require('https');
const util = require('util');
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');
const AWS = require('aws-sdk'),
    docClient = new AWS.DynamoDB.DocumentClient();

const commands = [
    {"path": "/start", "description":"시작 및 도움말"},
    {"path": "/recruits", "description":"현재 채용 목록"},
    {"path": "/subscribe", "description":"구독 등록"},
    {"path": "/unsubscribe", "description":"구독 해제"},
    {"path": "/github", "description":"주니어 개발자 채용 정보 Link"},
    {"path": "/facebook", "description":"페이스북 Link"}
];

exports.handler = (event, context) => {
    console.log(JSON.stringify(event));
    const requestChatId = event.message.chat.id;
    const requestText = event.message.text;

    if(requestText === "/start" || requestText === "/start@devbeginner_bot") {
        const intro = "초보개발자모임 Bot Commands\n" +
            "구독 등록(/subscribe) 하실 경우 신규 채용정보, 채용 팁, 페이스북 포스팅이 올라올때마다 알려드립니다.\n";
        const message = commands.map( c => c.path +" - " + c.description).join("\n");
        const postData = {
            "chat_id": requestChatId,
            "text": intro+message,
            "parse_mode": "Markdown"
        };

        sendMessage(context, postData);

    } else if(requestText === "/recruits"|| requestText === "/recruits@devbeginner_bot") {
        https.get(JSON_URL, (res) => {
            res.on('data', (d) => {
                const strJson = decoder.write(d);
                const recruits = JSON.parse(strJson).recruits;
                const postData = {
                    "chat_id": requestChatId,
                    "text": toMarkdownMessage(recruits),
                    "parse_mode": "Markdown"
                };
                sendMessage(context, postData);
            });
        });
    } else if(requestText === "/subscribe"|| requestText === "/subscribe@devbeginner_bot") {
        const payload = {
            TableName: TABLE_NAME,
            Item: {
                "chat_id": requestChatId
            }
        };

        docClient.put(payload, (err, data) => {
            if (err) {
                console.log(err, err.stack);
                const postData = {
                    "chat_id": requestChatId,
                    "text": "등록에 실패했습니다.\n잠시후 다시 시도해주세요."
                };
                sendMessage(context, postData);
                throw err;
            } else {
                const postData = {
                    "chat_id": requestChatId,
                    "text": "등록되었습니다."
                };
                sendMessage(context, postData);
            }
        });
    } else if(requestText === "/unsubscribe"|| requestText === "/unsubscribe@devbeginner_bot") {
        const payload = {
            TableName: TABLE_NAME,
            Key: {
                "chat_id": requestChatId
            }
        };

        docClient.delete(payload, (err, data) => {
            if (err) {
                console.log(err, err.stack);
                const postData = {
                    "chat_id": requestChatId,
                    "text": "등록해제에 실패했습니다.\n잠시후 다시 시도해주세요."
                };
                sendMessage(context, postData);
                throw err;
            } else {
                const postData = {
                    "chat_id": requestChatId,
                    "text": "등록해제 되었습니다."
                };
                sendMessage(context, postData);
            }
        });

    } else if(requestText === "/github"|| requestText === "/github@devbeginner_bot"){
        const postData = {
            "chat_id": requestChatId,
            "text": "http://bit.ly/2JpiOs7"
        };

        sendMessage(context, postData);

    } else if(requestText === "/facebook"|| requestText === "/facebook@devbeginner_bot"){
        const postData = {
            "chat_id": requestChatId,
            "text": "http://bit.ly/2HBXkSW"
        };

        sendMessage(context, postData);

    } else {
        console.log("없는 명령어 입니다. "+ requestText);
    }
};

function toMarkdownMessage(recruits) {
    return recruits
        .map( (r) => "( ~ " + r.endDate + ") [" +r.description + "]("+r.link+")")
        .join("\n");
}

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

