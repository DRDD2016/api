import test from 'blue-tape';
import client from '../../src/db/client';
import getEvent from '../../src/lib/events/get-event';
import { event_1 } from '../utils/fixtures';

const event_id = 1;

test.skip('`getEvent` works', (t) => {
  t.plan(2);

  const expected = event_1;
  getEvent(client, event_id)
    .then((result) => {
      t.deepEqual(result, expected, 'correct event retrieved');
    });

  getEvent(client, 99)
    .then((result) => {
      t.notOk(result, 'handles non-existent event_id');
    });
});

test.skip('`getEvent` handles errors', (t) => {
  return t.shouldFail(getEvent(client, ""), 'handles missing event_id');
});
