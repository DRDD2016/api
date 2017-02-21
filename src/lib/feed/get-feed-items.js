import query from '../../db/query';
import { getFeedItems as queryText } from '../../db/sql-queries.json';

/**
 * getFeedItems retrieves a user's feed items from the database
 * @returns {Promise.<object, Error>}
 * @param {object} client - database client
 * @param {number} user_id - user id
 */

export default function getFeedItems (client, user_id) {

  return new Promise ((resolve, reject) => {

    if (arguments.length !== 2) {
      return reject(new TypeError('`getFeedItems` requires 2 arguments.  See docs for usage'));
    }
    if (user_id === undefined) {
      return reject(new TypeError('`getFeedItems` requires an user_id'));
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
