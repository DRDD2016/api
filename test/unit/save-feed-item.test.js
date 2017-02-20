import test from 'blue-tape';
import client from '../../src/db/client';
import query from '../../src/db/query';
import saveFeedItem from '../../src/lib/events/save-feed-item';
import { feedItem_1, feedItems } from '../utils/fixtures';
const initDb = require('../utils/init-db')(client);

test('`saveFeedItem` works', (t) => {
  t.plan(9);
  initDb()
  .then(() => {

    const user_id_array = [1, 2, 3];
    const event_id = 3;
    saveFeedItem(client, user_id_array, event_id, feedItem_1)
    .then(() => {
      const queryText = 'SELECT * FROM feeds WHERE event_id = $1 ORDER BY user_id;';
      const queryArray = [3];
      query(client, queryText, queryArray, (err, result) => {
        result.forEach((row, i) => {
          t.equal(row.user_id, user_id_array[i], 'user ids match');
          t.equal(row.event_id, event_id, 'event ids match');
          t.deepEqual(row.data, feedItem_1, 'feed items match');
        });
      });
    });
  });
});

test('`saveFeedItem` adds new feed items to pre-existing ones', (t) => {
  t.plan(1);
  initDb()
  .then(() => {

    const user_id = 3;
    const event_id = 4;
    const newFeedItem = JSON.stringify(feedItem_1);
    saveFeedItem(client, [user_id], event_id, newFeedItem)
    .then(() => {
      const queryText = 'SELECT array_agg(data) FROM feeds WHERE user_id = $1;';
      const queryArray = [3];
      query(client, queryText, queryArray, (err, result) => {
        t.deepEqual(result[0].array_agg, [...feedItems].concat([feedItem_1]), 'feed items match');
      });
    });
  });
});
