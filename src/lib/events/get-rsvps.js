import query from '../../db/query';
import { getRsvps as queryText } from '../../db/sql-queries.json';

/**
 * Retrieve an event from the database
 * @returns {Promise.<object (event), Error>}
 * @param {object} client - database client
 * @param {number} event_id - event id
 */

export default function getRsvps (client, event_id) {

  return new Promise ((resolve, reject) => {

    if (!event_id) {
      return reject(new TypeError('`getRsvps` requires an event_id'));
    }
    const queryValues = [event_id];

    query(client, queryText, queryValues, (err, result) => {
      if (err) {
        return reject(err);
      }
      const mapped = result.reduce((obj, row) => {
        obj[row.status] = row.invitees;
        return obj;
      }, {});
      return result.length === 0 ? resolve(null) : resolve(mapped);
    });
  });
}
