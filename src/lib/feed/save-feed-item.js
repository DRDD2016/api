import query from '../../db/query';
import { saveFeedItem as queryText } from '../../db/sql-queries.json';

/**
 * Saves feed items to the database
 * @returns {Promise.<void, Error>}
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

    (function saveForUserID (array, event_id, data) {
      if (array.length === 0) {
        return resolve();
      }
      const queryValues = [array[0], event_id, data];

      query(client, queryText, queryValues, (err) => {
        if (err) {
          return reject(err);
        }
        saveForUserID(array.slice(1), event_id, data);
      });
    })(user_id_array, event_id, data);
  });
}
