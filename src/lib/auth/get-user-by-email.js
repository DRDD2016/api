import query from '../../db/query';
import { getUserByEmail as queryText } from '../../db/sql-queries.json';

/**
 * Find a user by email address in the database
 * @returns {Promise.<void, Error>}
 * @param {object} client - database client
 * @param {string} email - user email
 */

export default function getUserByEmail (client, email) {
  return new Promise ((resolve, reject) => {
    if (!email) return reject(new TypeError('`getUserByEmail` requires email { string }'));

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
      resolve(data[0]);
    });
  });
}
