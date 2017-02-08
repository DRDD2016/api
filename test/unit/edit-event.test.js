import test from 'blue-tape';
import client from '../../src/db/client';
import editEvent from '../../src/lib/events/edit-event';
import { editedEvent } from '../utils/fixtures';
const initDb = require('../utils/init-db')(client);

const event_id = 3;

test('`editEvent` works', (t) => {
  t.plan(1);
  initDb()
  .then(() => {
    editEvent(client, event_id, editedEvent)
      .then((result) => {
        t.deepEqual(result, editedEvent, 'Event succesfully updated');
      });
  });
});

test('`editEvent` handles empty event object', (t) => {
  return initDb()
  .then(() => t.shouldFail(editEvent(client, event_id, {}), 'Promise rejects'));
});

test('`editEvent` handles wrong number of arguments', (t) => {
  return initDb()
  .then(() => t.shouldFail(editEvent(client, {}), 'Promise rejects'));
});
