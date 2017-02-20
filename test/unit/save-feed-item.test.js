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
  t.plan(3);
  initDb()
  .then(() => {

    const user_id = 3;
    const event_id = 4;
    const newFeedItem = JSON.stringify([feedItem_1]);
    saveFeedItem(client, [user_id], event_id, newFeedItem)
    .then(() => {
      const queryText = 'SELECT * FROM feeds WHERE user_id = $1;';
      const queryArray = [3];
      query(client, queryText, queryArray, (err, result) => {
        console.log(result);
        t.equal(result[0].user_id, user_id, 'user ids match');
        t.equal(result[0].event_id, event_id, 'event ids match');
        t.deepEqual(result[0].data, [feedItem_1].concat(feedItems), 'feed items match');
      });
    });
  });
});
