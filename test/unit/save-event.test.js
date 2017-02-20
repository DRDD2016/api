import test from 'blue-tape';
import client from '../../src/db/client';
import saveEvent from '../../src/lib/events/save-event';
import { newEvent } from '../utils/fixtures';
const initDb = require('../utils/init-db')(client);

test('`saveEvent` works', (t) => {
  t.plan(1);

  initDb()
  .then(() => {

    saveEvent(client, newEvent)
    .then((event_id) => {
      t.equal(event_id, 5);
    });
  });
});

test('`saveEvent` handles errors', (t) => {
  return initDb()
  .then(() => t.shouldFail(saveEvent(client, {}), 'Promise rejects'));
});
