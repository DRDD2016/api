import query from '../../db/query';
import { getUserByResetToken as queryText } from '../../db/sql-queries.json';

/**
 * Get a user by reset password token from the database
 * @returns {Promise.<object, Error>}
 * @param {object} client - database client
 * @param {string} token - reset password token
 */

export default function getUserByToken (client, token) {
  return new Promise((resolve, reject) => {
    if (!token) return reject(new TypeError('`getUserByToken` requires token { string }'));

    const queryValues = [
      token
    ];

    query(client, queryText, queryValues, (err, data) => {

      if (err) {
        reject(err);
      }

      if (data.length === 0) {
        return resolve(false);
      }
      
      console.log('result', data[0]);
      resolve(data[0]);
    });
  });
}
