import test from 'blue-tape';
import client from '../../src/db/client';
import buildFeedItem from '../../src/lib/feed/build-feed-item';
import { event_3, feedItem_3 } from '../utils/fixtures';
const initDb = require('../utils/init-db')(client);

const invitee_user_id = 3;

test('`buildFeedItem` works', (t) => {
  t.plan(1);
  initDb()
  .then(() => {

    buildFeedItem(invitee_user_id, event_3)
    .then((result) => {

      t.ok(
        Object.keys(feedItem_3).every((key) => {
          return result.hasOwnProperty(key);
        })
      );
    });
  }).catch(err => console.error(err));
});

test('`buildFeedItem` handles unknown user id and missing event', (t) => {
  t.plan(3);
  initDb()
  .then(() => {

    buildFeedItem(55, event_3)
    .then((result) => {
      t.ok(result instanceof Error, 'result is an instance of Error');
      t.equal(result.message, 'User does not exist', 'returns correct error message');
    });

    buildFeedItem(invitee_user_id)
    .then((result) => {
      t.ok(result instanceof Error, 'result is an instance of Error');
    });
  }).catch(err => console.error(err));
});
