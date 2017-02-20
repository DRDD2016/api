import test from 'blue-tape';
import client from '../../src/db/client';
import getHostId from '../../src/lib/events/get-host-id';
const initDb = require('../utils/init-db')(client);

const event_id = 3;

test('`getHostId` works', (t) => {
  t.plan(2);
  initDb()
  .then(() => {

    const expected = [3];
    getHostId(client, event_id)
    .then((result) => {
      t.deepEqual(result, expected, 'correct host user id retrieved');
    });

    getHostId(client, 99)
    .then((result) => {
      t.notOk(result, 'handles non-existent event_id');
    });
  });
});

test('`getHostId` handles errors', (t) => {
  return initDb()
  .then(() => t.shouldFail(getHostId(client, ""), 'handles missing event_id'));
});
