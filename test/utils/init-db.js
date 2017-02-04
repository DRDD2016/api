const fs = require('fs');

const initDb = (client) => () => {

  return new Promise ((resolve, reject) => {

    client.connect((error, client, done) => {
      if (error) {
        console.error(error);
        return reject(error);
      }
      fs.readFile(`${__dirname}/schema.sql`, 'utf8', (error, schema) => {
        client.query(schema, (error) => {
          if (error) {
            return reject(error);
          }
          done();
          resolve();
        });
      });
    });
  });
};

module.exports = initDb;
