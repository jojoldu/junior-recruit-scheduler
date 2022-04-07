const appRoot = require('app-root-path');

/**
 *
 * @returns {Promise<object>}
 */
async function build() {
  const json = appRoot.require('/data/db.json');
  return JSON.parse(JSON.stringify(json));
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

