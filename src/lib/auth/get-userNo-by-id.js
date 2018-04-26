import query from '../../db/query';
import { getUserNoById as queryText } from '../../db/sql-queries.json';

/**
 * Get a user's update and open no's by user_id from the database
 * @returns {Promise.<void, Error>}
 * @param {object} client - database client
 * @param {string} user_id - user id
 */

export default function getUserNoById (client, user_id) {
  return new Promise((resolve, reject) => {
    if (!user_id) return reject(new TypeError('`getUserNoById` requires user_id { string }'));

    const queryValues = [
      user_id
    ];

    query(client, queryText, queryValues, (err, data) => {

      if (err) {
        reject(err);
      }

      if (!data || data.length === 0) {
        return resolve(false);
      }

      resolve(data[0]);
    });
  });
}
