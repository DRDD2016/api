import test from 'blue-tape';
import client from '../../src/db/client';
import getInviteesIds from '../../src/lib/events/get-invitees-ids';
import { inviteesIds } from '../utils/fixtures';
const initDb = require('../utils/init-db')(client);

const event_id = 3;

test('`getInviteesIds` works', (t) => {
  t.plan(2);
  initDb()
  .then(() => {

    const expected = inviteesIds;
    getInviteesIds(client, event_id)
    .then((result) => {
      t.deepEqual(result, expected, 'correct array of invitees ids retrieved');
    });

    getInviteesIds(client, 99)
    .then((result) => {
      t.notOk(result, 'handles non-existent event_id');
    });
  });
});

test('`getInviteesIds` handles errors', (t) => {
  return initDb()
  .then(() => t.shouldFail(getInviteesIds(client, ""), 'handles missing event_id'));
});
