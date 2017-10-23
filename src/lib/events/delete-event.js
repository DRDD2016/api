import query from '../../db/query';
import { deleteEvent as queryText } from '../../db/sql-queries.json';
import normaliseEventKeys from '../normalise-event-keys';

/**
 * Deletes an event from the database
 * @param {object} client - database client
 * @param {string} event_id - event id
 * @param {object} data - event object
 * @returns {Promise.<object, Error>}
 */

export default function deleteEvent (client, event_id, data) {

  return new Promise ((resolve, reject) => {

    if (arguments.length !== 3) {
      return reject(new TypeError('`deleteEvent` requires 3 arguments.  See docs for usage'));
    }

    if (!data || Object.keys(data).length === 0) {
      return reject(new TypeError('`deleteEvent` event data is empty or undefined'));
    }

    const queryValues = [
      event_id,
    ];

    const eventName = data.name
    console.info('deleteEvent data: ', data);
    console.info('deleteEvent eventName: ', eventName);


    query(client, queryText, queryValues, (err) => {
      if (err) {
        reject(err);
      }
      console.info('resolve: ', eventName);
      return resolve(eventName);
    });
  });
}
