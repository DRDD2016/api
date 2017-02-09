import test from 'blue-tape';
import client from '../../src/db/client';
import buildFeedItem from '../../src/lib/events/build-feed-item';
import { event_3, feedItem } from '../utils/fixtures';
const initDb = require('../utils/init-db')(client);

const invitee_user_id = 3;

test('`buildFeedItem` works', (t) => {
  t.plan(1);
  initDb()
  .then(() => {

    buildFeedItem(invitee_user_id, event_3)
    .then((result) => {

      t.ok(
        Object.keys(feedItem).every((key) => {
          return result.hasOwnProperty(key);
        })
      );
    });
  }).catch(err => console.error(err));
});
