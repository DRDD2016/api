import test from 'blue-tape';
import client from '../../src/db/client';
import getRsvps from '../../src/lib/events/get-rsvps';
import { rsvps } from '../utils/fixtures';

const event_id = 1;

test.only('`getRsvps` works', (t) => {
  t.plan(2);

  const expected = rsvps;
  getRsvps(client, event_id)
    .then((result) => {
      t.deepEqual(result, expected, 'correct rsvps retrieved');
    });

  getRsvps(client, 99)
    .then((result) => {
      t.notOk(result, 'handles non-existent event_id');
    });
});

test('`getRsvps` handles errors', (t) => {
  return t.shouldFail(getRsvps(client, ""), 'handles missing event_id');
});
