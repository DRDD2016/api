import test from 'blue-tape';
import client from '../../src/db/client';
import query from '../../src/db/query';
import finaliseEvent from '../../src/lib/events/finalise-event';
import { hostEventChoices } from '../utils/fixtures';
const initDb = require('../utils/init-db')(client);

const event_id = 1;

test('`finaliseEvent` works', (t) => {
  t.plan(2);
  initDb()
  .then(() => {

    finaliseEvent(client, event_id, hostEventChoices)
    .then((result) => {
      t.deepEqual(result, hostEventChoices, 'event updated correctly');
      const queryText = 'SELECT is_poll FROM events WHERE event_id = $1;';
      query(client, queryText, [event_id], (err, result2) => {
        t.deepEqual(result2[0], { is_poll: false }, 'event updated to longer be a poll');
      });
    })
    .catch(err => console.error(err));
  });

});

test('`finaliseEvent` handles errors', (t) => {
  return initDb()
  .then(() => t.shouldFail(finaliseEvent(client, ""), 'handles missing arguments'));
});
