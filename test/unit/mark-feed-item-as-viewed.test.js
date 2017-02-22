import test from 'blue-tape';
import client from '../../src/db/client';
import query from '../../src/db/query';
import markFeedItemAsViewed from '../../src/lib/feed/mark-feed-item-as-viewed';
import { feedItem_1 } from '../utils/fixtures';
const initDb = require('../utils/init-db')(client);

test('`markFeedItemAsViewed` works', (t) => {
  t.plan(1);
  initDb()
  .then(() => {

    const feed_item_id = 1;
    const expected = { ...feedItem_1, viewed: true };
    markFeedItemAsViewed(client, feed_item_id)
    .then(() => {
      const queryText = 'SELECT data FROM feeds WHERE id = $1;';
      const queryArray = [1];
      query(client, queryText, queryArray, (err, result) => {
        t.deepEqual(result[0].data, expected);
      });
    });
  });
});
