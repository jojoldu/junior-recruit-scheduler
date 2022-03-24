const fs = require('fs-extra');

/**
 *
 * @returns {Promise<object>}
 */
async function build() {
  const json = await fs.readFile('db.json', 'utf8');
  return JSON.parse(JSON.stringify(json.trim()));
}

const failMessage = 'db.json Parse Fail';

build()
  .then((data) => {
      if(data.length === 0) {
          console.log(failMessage);
          throw new Error('build는 성공했으나 JSON이 비어있습니다.');
      }
      console.log('JSON Compile Success')
  })
  .catch(e => {
      console.log(failMessage, e);
      throw e;
  });

