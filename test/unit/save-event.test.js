import test from 'blue-tape';
import client from '../../src/db/client';
import saveEvent from '../../src/lib/events/save-event';
import { newEvent } from '../utils/fixtures';

test('`saveEvent` works', () => {
  return saveEvent(client, newEvent);
});

test('`saveEvent` handles errors', (t) => {
  return t.shouldFail(saveEvent(client, {}), 'Promise rejects');
});
