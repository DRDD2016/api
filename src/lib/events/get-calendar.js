import query from '../../db/query';
import { getCalendar as queryText } from '../../db/sql-queries.json';

/**
 * Retrieve a user's calendar from the database
 * @returns {Promise.<object (event), Error>}
 * @param {object} client - database client
 * @param {number} user_id - user id
 */

export default function getCalendar (client, user_id) {

  return new Promise ((resolve, reject) => {

    if (arguments.length !== 2) {
      return reject(new TypeError('`getCalendar` requires 2 arguments.  See docs for usage'));
    }
    if (user_id === undefined) {
      return reject(new TypeError('`getCalendar` requires an user_id'));
    }
    const queryValues = [user_id];
    query(client, queryText, queryValues, (err, result) => {
      if (err) {
        return reject(err);
      }
      return result.length === 0 ?
      resolve(null) :
      resolve(result);
    });
  });
}
