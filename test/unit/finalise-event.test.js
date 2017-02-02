import test from 'blue-tape';
import client from '../../src/db/client';
import finaliseEvent from '../../src/lib/events/finalise-event';
import { hostEventChoices } from '../utils/fixtures';

const event_id = 1;

test('`finaliseEvent` works', (t) => {
  t.plan(1);

  finaliseEvent(client, event_id, hostEventChoices)
    .then((result) => {
      t.deepEqual(result, hostEventChoices, 'event updated correctly');
    })
    .catch(err => console.error(err));
});

test('`finaliseEvent` handles errors', (t) => {
  return t.shouldFail(finaliseEvent(client, ""), 'handles missing arguments');
});
