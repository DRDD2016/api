import query from '../../db/query';
import { markFeedItemAsViewed as queryText } from '../../db/sql-queries.json';

/**
 * markFeedItemAsViewed changes a feed item's `viewed` flag to true
 * @param {object} client - database client
 * @param {string} feed_item_id - feed item id
 * @returns {Promise.<void, Error>}
 */

export default function markFeedItemAsViewed (client, feed_item_id) {
  return new Promise ((resolve, reject) => {

    if (arguments.length !== 2) {
      return reject(new TypeError('`markFeedItemAsViewed` requires 2 arguments.  See docs for usage'));
    }

    const queryValues = [feed_item_id];

    query(client, queryText, queryValues, (err) => {
      if (err) {
        reject(err);
      }
      return resolve();
    });
  });
}
