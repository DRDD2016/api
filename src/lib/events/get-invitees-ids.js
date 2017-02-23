import query from '../../db/query';
import { getInviteesIds as queryText } from '../../db/sql-queries.json';

/**
 * getInviteesIds retrieves an array of invitees ids for specific event from the database
 * @returns {Promise.<array, Error>} - array of invitee ids
 * @param {object} client - database client
 * @param {number} event_id - event id
 */

export default function getInviteesIds (client, event_id) {
  return new Promise ((resolve, reject) => {

    if (arguments.length !== 2) {
      return reject(new TypeError('`getInviteesIds` requires 2 arguments.  See docs for usage'));
    }
    if (!event_id) {
      return reject(new TypeError('`getInviteesIds` requires an event_id'));
    }
    const queryValues = [event_id];
    query(client, queryText, queryValues, (err, result) => {
      if (err) {
        return reject(err);
      }
      return result.length === 0 ? resolve(null) : resolve(result[0].ids);
    });
  });
}
