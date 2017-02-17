import query from '../../db/query';
import { getRsvps as queryText } from '../../db/sql-queries.json';
import normaliseRsvps from '../normalise-rsvps';

/**
 * getRsvps retrieves an event's invitees from the database
 * @param {object} client - database client
 * @param {number} event_id - event id
 * @returns {Promise.<object (rsvps), Error>}
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
      return resolve(normaliseRsvps(mapped));
    });
  });
}
