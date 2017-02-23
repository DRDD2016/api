import test from 'blue-tape';
import deleteEvent from '../../src/lib/events/delete-event';
import client from '../../src/db/client';
const initDb = require('../utils/init-db')(client);

const event_id = 3;

test('`deleteEvent` works', () => {
  return initDb()
  .then(() => deleteEvent(client, event_id));
});

test('`deleteEvent` handles non existent event', (t) => {
  t.plan(1);
  initDb()
  .then(() => {

    deleteEvent(client, 99)
    .then((result) => {
      t.notOk(result, 'handles non-existent event_id');
    });
  });
});

test('`deleteEvent` handles errors', (t) => {
  return initDb()
  .then(() => t.shouldFail(deleteEvent(client), 'handles missing event_id'));
});
