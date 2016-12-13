import query from '../../db/query';
import SQLqueries from '../../db/sql-queries.json';

/**
 * Retrieve an event from the database
 * @returns {Promise.<object (event), Error>}
 * @param {object} client - database client
 * @param {number} event_id - event id
 */

export default function getEvent (client, event_id) {

  return new Promise ((resolve, reject) => {

    if (!event_id) {
      return reject(new TypeError('`getEvent` requires an event_id'));
    }
    const queryText = SQLqueries.getEvent;
    const queryValues = [event_id];

    query(client, queryText, queryValues, (err, result) => {
      if (err) {
        return reject(err);
      }
      return result.length === 0 ? resolve(null) : resolve(result[0].row_to_json);
    });
  });
}
