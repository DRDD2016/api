import query from '../../db/query';
import { saveFeedItem as queryText } from '../../db/sql-queries.json';

/**
 * Saves feed items to the database
 * @returns {Promise.<object, Error>}
 * @param {object} client - database client
 * @param {array} user_id_array - array of user ids
 * @param {number} event_id - event id
 * @param {object} data - feed item object
 */

export default function saveFeedItem (client, user_id_array, event_id, data) {
  return new Promise ((resolve, reject) => {

    if (arguments.length !== 4) {
      return reject(new TypeError('`saveFeedItem` requires 4 arguments.  See docs for usage'));
    }
    if (!data || Object.keys(data).length === 0) {
      return reject(new TypeError('`saveFeedItem` event data is empty or undefined'));
    }

    (function saveForUserID (array, event_id, data, result) {
      if (array.length === 0) {
        return resolve(result[0]);
      }
      const queryValues = [array[0], event_id, data];

      query(client, queryText, queryValues, (err, result) => {
        if (err) {
          return reject(err);
        }
        saveForUserID(array.slice(1), event_id, data, result);
      });
    })(user_id_array, event_id, data, null);
  });
}
