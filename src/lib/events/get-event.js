import query from '../../db/query';
import { getEvent as queryText } from '../../db/sql-queries.json';
import normaliseEventKeys from '../normalise-event-keys';

/**
 * Retrieve an event from the database
 * @returns {Promise.<object (event), Error>}
 * @param {object} client - database client
 * @param {number} event_id - event id
 */

export default function getEvent (client, event_id) {

  return new Promise ((resolve, reject) => {

    if (arguments.length !== 2) {
      return reject(new TypeError('`getEvent` requires 2 arguments.  See docs for usage'));
    }
    if (event_id === undefined) {
      return reject(new TypeError('`getEvent` requires an event_id'));
    }
    const queryValues = [event_id];
    query(client, queryText, queryValues, (err, result) => {
      if (err) {
        return reject(err);
      }
      return result.length === 0 ?
      resolve(null) :
      resolve(normaliseEventKeys(result[0].row_to_json));
    });
  });
}
