import query from '../../db/query';
import { saveEvent as queryText } from '../../db/sql-queries.json';

/**
 * Save an event to the database
 * @returns {Promise.<number, Error>}
 * @param {object} client - database client
 * @param {object} data - event data
 */

export default function saveEvent (client, data) {
  return new Promise ((resolve, reject) => {

    if (!data || Object.keys(data).length === 0) {
      return reject(new TypeError('`saveEvent` event data is empty or undefined'));
    }
    const queryValues = [
      data.host_user_id,
      data.name,
      data.description,
      data.note,
      data.what,
      data.where,
      data.when,
      data.is_poll,
      data.code
    ];
    query(client, queryText, queryValues, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result[0].event_id);
    });
  });
}
