import query from '../../db/query';
import { deleteEvent as queryText } from '../../db/sql-queries.json';

/**
 * Deletes an event from the database
 * @returns {Promise.<void, Error>}
 * @param {object} client - database client
 * @param {number} event_id - event id
 */

export default function deleteEvent (client, event_id) {

  return new Promise ((resolve, reject) => {

    if (!event_id) {
      return reject(new TypeError('`deleteEvent` requires an event_id'));
    }
    const queryValues = [event_id];

    query(client, queryText, queryValues, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}
