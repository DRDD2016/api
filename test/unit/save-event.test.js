import test from 'blue-tape';
import client from '../../src/db/client';
import saveEvent from '../../src/lib/event/save-event';
import { newEvent } from '../utils/fixtures';

test('`saveEvent` works', (t) => {
  return saveEvent(client, newEvent, 'Promise resolves');

});

test('`saveEvent` handles errors', (t) => {
  return t.shouldFail(saveEvent(client, {}, 'Promise rejects'));
});
