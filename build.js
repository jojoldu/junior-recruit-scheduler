/**
 * Created by jojoldu@gmail.com on 09/06/2018
 * Blog : http://jojoldu.tistory.com
 * Github : http://github.com/jojoldu
 */

var fs = require('fs');
var obj;
fs.readFile('db.json', 'utf8', function (err, data) {
    if (err) throw err;
    try {
        obj = JSON.parse(data);
    } catch (e) {
        throw e;
    }

    console.log('JSON Compile Success');
});
