import test from 'blue-tape';
import client from '../../src/db/client';
import updateEvent from '../../src/lib/events/update-event';
import { updatedEvent } from '../utils/fixtures';
const initDb = require('../utils/init-db')(client);

const event_id = 3;

test('`updateEvent` works', (t) => {
  t.plan(1);
  initDb()
  .then(() => {
    updateEvent(client, event_id, updatedEvent)
      .then((result) => {
        t.deepEqual(result, updatedEvent, 'Event succesfully updated');
      });
  });
});

test('`updateEvent` handles empty event object', (t) => {
  return initDb()
  .then(() => t.shouldFail(updateEvent(client, event_id, {}), 'Promise rejects'));
});

test('`updateEvent` handles wrong number of arguments', (t) => {
  return initDb()
  .then(() => t.shouldFail(updateEvent(client, {}), 'Promise rejects'));
});
