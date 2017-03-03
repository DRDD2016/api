import test from 'blue-tape';
import client from '../../src/db/client';
import getEvent from '../../src/lib/events/get-event';
import { event_1 } from '../utils/fixtures';
const initDb = require('../utils/init-db')(client);

const event_id = 1;
const expected = { ...event_1, host_photo_url: 'https://s3.eu-west-2.amazonaws.com/spark-native/avatar.png' };

test('`getEvent` works', (t) => {
  t.plan(3);
  initDb()
  .then(() => {

    getEvent(client, event_id)
    .then((result) => {
      t.deepEqual(result, expected, 'correct event retrieved');
      t.ok(result.host_photo_url, 'Event includes host photo url');
    })
    .catch((err) => {
      console.error(err);
    });

    getEvent(client, 99)
    .then((result) => {
      t.notOk(result, 'handles non-existent event_id');
    })
    .catch((err) => {
      console.error(err);
    });
  });

});

test('`getEvent` handles errors', (t) => {
  return initDb()
  .then(() => t.shouldFail(getEvent(client, ""), 'handles missing event_id'));
});
