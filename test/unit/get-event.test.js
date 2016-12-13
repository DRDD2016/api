import test from 'blue-tape';
import client from '../../src/db/client';
import getEvent from '../../src/lib/events/get-event';
import { event_1 } from '../utils/fixtures';

const event_id = 1;

test('`getEvent` works', (t) => {
  t.plan(2);

  const expected = Object.assign({}, event_1, { is_edited: false });
  getEvent(client, event_id)
    .then((result) => {
      t.deepEqual(result, expected, 'correct event retrieved');
    });

  getEvent(client, 99)
    .then((result) => {
      t.notOk(result, 'handles non-existent event_id');
    });
});

test('`getEvent` handles errors', (t) => {
  return t.shouldFail(getEvent(client, ""), 'handles missing event_id');
});
