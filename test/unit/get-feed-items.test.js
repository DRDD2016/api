import test from 'blue-tape';
import client from '../../src/db/client';
import getFeedItems from '../../src/lib/feed/get-feed-items';
import { feedItems } from '../utils/fixtures';
const initDb = require('../utils/init-db')(client);

const user_id = 3;

test('`getFeedItems` works', (t) => {
  t.plan(2);
  initDb()
  .then(() => {

    const expected = feedItems;
    getFeedItems(client, user_id)
    .then((result) => {
      t.deepEqual(result, expected, 'correct feed items retrieved');
    });

    getFeedItems(client, 99)
    .then((result) => {
      t.notOk(result, 'handles non-existent user_id');
    });
  });
});

test('`getFeedItems` handles errors', (t) => {
  return initDb()
  .then(() => t.shouldFail(getFeedItems(client, ""), 'handles missing user_id'));
});
