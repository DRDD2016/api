import query from '../../db/query';
import { updateRsvp as queryText } from '../../db/sql-queries.json';

/**
 * updateRsvp updates an invitee's rsvp status
 * @returns {Promise.<void, Error>}
 * @param {object} client - database client
 * @param {string} user_id - user id
 * @param {string} event_id - event id
 * @param {string} status - user rsvp status
 */

const VALID_STATUSES = ['going', 'maybe', 'not_going'];

export default function updateRsvp (client, user_id, event_id, status) {

  return new Promise ((resolve, reject) => {
    if (arguments.length !== 4) {
      return reject(new TypeError('`updateRsvp` requires 4 arguments.  See docs for usage'));
    }
    if (!user_id || !event_id || !status) {
      return reject(new TypeError('`updateRsvp`: bad arguments. See docs for usage'));
    }
    if (!VALID_STATUSES.includes(status)) {
      return reject(new TypeError('`updateRsvp`: invalid `status` argument'));
    }
    const queryValues = [user_id, event_id, status];

    query(client, queryText, queryValues, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}
