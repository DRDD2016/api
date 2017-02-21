import query from '../../db/query';
import { saveFeedItemForDeletedEvent as queryText } from '../../db/sql-queries.json';

/**
 * Saves feed items to the database for a deleted event
 * @returns {Promise.<void, Error>}
 * @param {object} client - database client
 * @param {array} user_id_array - array of user ids
 * @param {object} data - feed item object
 */

export default function saveFeedItemForDeletedEvent (client, user_id_array, data) {
  return new Promise ((resolve, reject) => {

    if (arguments.length !== 3) {
      return reject(new TypeError('`saveFeedItemForDeletedEvent` requires arguments.  See docs for usage'));
    }
    if (!data || Object.keys(data).length === 0) {
      return reject(new TypeError('`saveFeedItemForDeletedEvent` event data is empty or undefined'));
    }

    (function saveForUserID (array, data) {
      if (array.length === 0) {
        return resolve();
      }
      const queryValues = [array[0], data];

      query(client, queryText, queryValues, (err) => {
        if (err) {
          return reject(err);
        }
        saveForUserID(array.slice(1), data);
      });
    })(user_id_array, data);
  });
}
