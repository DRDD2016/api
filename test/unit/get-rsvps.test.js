import test from 'blue-tape';
import client from '../../src/db/client';
import getRsvps from '../../src/lib/events/get-rsvps';
import { rsvps_3, rsvps_2 } from '../utils/fixtures';
const initDb = require('../utils/init-db')(client);

const event_id = 3;

test('`getRsvps` works', (t) => {
  t.plan(2);
  initDb()
  .then(() => {

    const expected = rsvps_3;
    getRsvps(client, event_id)
    .then((result) => {
      t.deepEqual(result, expected, 'correct rsvps retrieved');
    });

    getRsvps(client, 99)
    .then((result) => {
      t.notOk(result, 'handles non-existent event_id');
    });
  });
});

test("`getRsvps` handles invitees who have not rsvp'd", (t) => {
  t.plan(2);
  initDb()
  .then(() => {
    const event_id = 2;
    const expected = rsvps_2;
    getRsvps(client, event_id)
    .then((result) => {
      t.ok(Object.keys(result).includes('not_responded'), "returns array of invitees who have not rsvp'd");
      t.deepEqual(result, expected, 'correct rsvps retrieved');
    });
  });
});

test('`getRsvps` handles errors', (t) => {
  return initDb()
  .then(() => t.shouldFail(getRsvps(client, ""), 'handles missing event_id'));
});
