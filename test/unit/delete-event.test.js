import test from 'blue-tape';
import client from '../../src/db/client';
import deleteEvent from '../../src/lib/events/delete-event';

const event_id = 3;

test.skip('`deleteEvent` works', (t) => {
  t.plan(1);

  deleteEvent(client, event_id)
    .then((result) => {
      t.deepEqual(result, { event_id }, `event ${event_id} successfully deleted`);
    });
});

test('`deleteEvent` handles non existent event', (t) => {
  t.plan(1);

  deleteEvent(client, 99)
    .then((result) => {
      t.notOk(result, 'handles non-existent event_id');
    });
});

test('`deleteEvent` handles errors', (t) => {
  return t.shouldFail(deleteEvent(client), 'handles missing event_id');
});
