import test from 'blue-tape';
import client from '../../src/db/client';
import query from '../../src/db/query';
import updateRsvp from '../../src/lib/events/update-rsvp';
const initDb = require('../utils/init-db')(client);

const invitee_user_id = 3;
const event_id = 4;
const status = 'going';
const expected = { user_id: 3, event_id: 4, status: 'going' };
const expected_2 = { user_id: 3, event_id: 4, status: 'not_going' };

  initDb()
    .then(() => {
      test('`updateRsvp` works', (t) => {
        t.plan(1);

        updateRsvp(client, invitee_user_id, event_id, status)
        .then(() => {
          const queryText = `SELECT * FROM rsvps WHERE user_id = $1 AND event_id = $2;`;
          const queryValues = [invitee_user_id, event_id];

          query(client, queryText, queryValues, (err, result) => {
            t.deepEqual(result[0], expected, 'Updates rsvp');
          });
        })
        .catch(err => console.error(err));
      });

      test('`updateRsvp` handles new rsvp entry', (t) => {
        t.plan(1);
        const newStatus = 'not_going';
        updateRsvp(client, invitee_user_id, event_id, newStatus)
        .then(() => {
          const queryText = `SELECT * FROM rsvps WHERE user_id = $1 AND event_id = $2;`;
          const queryValues = [invitee_user_id, event_id];

          query(client, queryText, queryValues, (err, result) => {
            t.deepEqual(result[0], expected_2, 'Updates previous rsvp without error');
          });
        })
        .catch(err => console.error(err));
      });
    }).catch(err => console.error(err));

test('`updateRsvp` handles errors', (t) => {
  return initDb()
  .then(() => t.shouldFail(updateRsvp(client, invitee_user_id, "", status), 'handles missing event id'));
});

test('`updateRsvp` handles errors', (t) => {
  return initDb()
  .then(() => t.shouldFail(updateRsvp(client, "", event_id, status), 'handles missing user id'));
});

test('`updateRsvp` handles errors', (t) => {
  return initDb()
  .then(() => t.shouldFail(updateRsvp(client, invitee_user_id, event_id, ""), 'handles missing status'));
});

test('`updateRsvp` handles errors', (t) => {
  return initDb()
  .then(() => t.shouldFail(updateRsvp(client, invitee_user_id, event_id, "fake-status"), 'handles unrecognised status'));
});
