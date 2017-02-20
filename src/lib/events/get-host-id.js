import query from '../../db/query';
import { getHostId as queryText } from '../../db/sql-queries.json';

/**
 * getHostId retrieves the host user id for specific event from the database
 * @returns {Promise.<array, Error>} - host user id
 * @param {object} client - database client
 * @param {number} event_id - event id
 */

export default function getHostId (client, event_id) {

  return new Promise ((resolve, reject) => {

    if (arguments.length !== 2) {
      return reject(new TypeError('`getHostId` requires 2 arguments.  See docs for usage'));
    }
    if (!event_id) {
      return reject(new TypeError('`getHostId` requires an event_id'));
    }
    const queryValues = [event_id];
    query(client, queryText, queryValues, (err, result) => {
      if (err) {
        return reject(err);
      }
      return result.length === 0 ? resolve(null) : resolve([result[0].host_user_id]);
    });
  });
}
