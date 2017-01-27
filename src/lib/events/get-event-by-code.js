import query from '../../db/query';
import { getEventByCode as queryText } from '../../db/sql-queries.json';

/**
 * Retrieve an event from the database
 * @returns {Promise.<object (event), Error>}
 * @param {object} client - database client
 * @param {string} code - event code
 */

export default function getEventByCode (client, code) {

  return new Promise ((resolve, reject) => {

    if (!code) {
      return reject(new TypeError('`getEventByCode` requires a code'));
    }
    const queryValues = [code];

    query(client, queryText, queryValues, (err, result) => {
      if (err) {
        return reject(err);
      }
      return result.length === 0 ? resolve(null) : resolve(result[0].row_to_json);
    });
  });
}
