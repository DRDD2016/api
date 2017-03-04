import query from '../../db/query';
import { getCategoryOptions as queryText } from '../../db/sql-queries.json';

/**
 * getCategoryOptions gets the number of options per category in an event
 * @param {object} client - database client
 * @param {string} event_id - event id
= * @returns {Promise.<object, Error>}
 */

export default function getCategoryOptions (client, event_id) {
  return new Promise ((resolve, reject) => {

    if (arguments.length !== 2) {
      return reject(new TypeError('`getCategoryOptions` requires 2 arguments.  See docs for usage'));
    }

    if (!event_id) {
      return reject(new TypeError('`getCategoryOptions` event id is null or undefined'));
    }

    const queryValues = [event_id];

    query(client, queryText, queryValues, (err, result) => {
      if (err) {
        reject(err);
      }
      if (result.length === 0) {
        return resolve(null);
      }
      // console.log('cat opts result', result);
      const categoryOptions = Object.keys(result[0]).reduce((acc, category) => {
        if (result[0][category] >= 2) {
          acc[category] = result[0][category];
        }
        return acc;
      }, {});
      console.log('cat opts final', categoryOptions);
      return resolve(categoryOptions);
    });
  });
}
