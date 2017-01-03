import query from '../../db/query';
import SQLqueries from '../../db/sql-queries.json';

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
    const queryText = SQLqueries.deleteEvent;
    const queryValues = [event_id];

    query(client, queryText, queryValues, (err, result) => {
      if (err) {
        return reject(err);
      }
      return result.length === 0 ? resolve(null) : resolve(result[0]);
    });
  });
}