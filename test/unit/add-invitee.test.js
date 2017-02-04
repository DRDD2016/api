import test from 'blue-tape';
import client from '../../src/db/client';
import addInvitee from '../../src/lib/events/add-invitee';
const initDb = require('../utils/init-db')(client);

const invitee_user_id = 2;
const event_id = 2;

test('`addInvitee` works', (t) => {
  initDb()
    .then(() => {
      t.plan(1);

      addInvitee(client, invitee_user_id, event_id)
      .then((result) => {
        t.ok(result);
      })
      .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
});

test('`addInvitee` handles errors', (t) => {
  return initDb()
  .then(() => t.shouldFail(addInvitee(client, invitee_user_id, ""), 'handles missing event id'));
});

test('`addInvitee` handles errors', (t) => {
  return initDb()
  .then(() =>t.shouldFail(addInvitee(client, "", event_id), 'handles missing user id'));
});
