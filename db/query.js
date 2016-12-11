/**
 * Query the database
 * @param {object} client - database client
 * @param {string} queryText - SQL query text
 * @param {array} queryArray - variables for the SQL query text
 */

export default function query (client, queryText, queryArray, callback) {

  if (arguments.length !== 4) {
    throw new RangeError('function `query` requires: \n @param {object} - database client\n @param {string} -SQL query text\n @param {array} (optional) - variables for the SQL query text');
  }
  client.connect((error, client, done) => {
    if (error) {
      return callback(error);
    }
    client.query(queryText, queryArray, (error, result) => {
      done();
      if (error) {
        return callback(error, null);
      } else {
        return callback(null, result.rows);
      }
    });
  });
}
