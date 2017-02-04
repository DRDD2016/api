import query from '../../db/query';
import { addInvitee as queryText } from '../../db/sql-queries.json';

/**
 * Adds an invitee's user id to an event
 * @returns {Promise.<object (event), Error>}
 * @param {object} client - database client
 * @param {string} user_id - user id
 * @param {string} event_id - event id
 */

export default function addInvitee (client, user_id, event_id) {

  return new Promise ((resolve, reject) => {
    if (!user_id || !event_id) {
      return reject(new TypeError('`addInvitee` requires a user_id and event_id'));
    }
    const queryValues = [user_id, event_id];

    query(client, queryText, queryValues, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve(true);
    });
  });
}
