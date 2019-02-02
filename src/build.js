/**
 * Created by jojoldu@gmail.com on 09/06/2018
 * Blog : http://jojoldu.tistory.com
 * Github : http://github.com/jojoldu
 */

const fs = require('fs');
fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) throw err;
    try {
        const trim = JSON.stringify(data.trim());
        JSON.parse(trim);
    } catch (e) {
        throw e;
    }

    console.log('JSON Compile Success');
});
