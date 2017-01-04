import query from '../../db/query';
import { saveEvent as queryText } from '../../db/sql-queries.json';

/**
 * Save an event to the database
 * @returns {Promise.<void, Error>}
 * @param {object} client - database client
 * @param {object} data - event data
 */

export default function saveEvent (client, data) {

  return new Promise ((resolve, reject) => {

    if (!data || Object.keys(data).length === 0) {
      return reject(new TypeError('`saveEvent` event data is empty or undefined'));
    }
    const queryValues = [
      data.host_user_id,
      data.name,
      data.description,
      data.note,
      data._what,
      data._where,
      data._when,
      data._invitees,
      data.is_poll
    ];
    query(client, queryText, queryValues, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}
