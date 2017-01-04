import query from '../../db/query';
import SQLqueries from '../../db/sql-queries.json';

/**
 * Find a user by email address in the database
 * @returns {Promise.<void, Error>}
 * @param {object} client - database client
 * @param {string} email - user email
 */

export default function findUserByEmail (client, email) {
  return new Promise ((resolve, reject) => {

    if (!email) return reject(new TypeError('`findUserByEmail` requires email { string }'));

    const queryText = SQLqueries.findUser;
    const queryValues = [
      email
    ];

    query(client, queryText, queryValues, (err, data) => {

      if (err) {
        reject(err);
      }

      if (data.length === 0) {
        return resolve(false);
      }

      resolve(true);
    });
  });
}
