import query from '../../db/query';
import { updateEvent as queryText } from '../../db/sql-queries.json';
import normaliseEventKeys from '../normalise-event-keys';

/**
 * Updates an existing event
 * @param {object} client - database client
 * @param {string} user_id - user id
 * @param {string} event_id - event id
 * @param {object} data - event object
 * @returns {Promise.<void, Error>}
 */

export default function updateEvent (client, event_id, data) {
  return new Promise ((resolve, reject) => {

    if (arguments.length !== 3) {
      return reject(new TypeError('`updateEvent` requires 3 arguments.  See docs for usage'));
    }

    if (!data || Object.keys(data).length === 0) {
      return reject(new TypeError('`updateEvent` event data is empty or undefined'));
    }

    const queryValues = [
      data.event_id,
      data.name,
      data.description,
      data.note,
      data.what[0],
      data.where[0],
      data.when[0]
    ];

    query(client, queryText, queryValues, (err, result) => {
      if (err) {
        reject(err);
      }

      return result.length === 0 ? resolve(null) : resolve(normaliseEventKeys(result[0]));
    });
  });
}
