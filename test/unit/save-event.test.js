import test from 'tape';
import client from '../../src/db/client';
import saveEvent from '../../src/lib/event/save-event';
import { newEvent } from '../utils/fixtures';

test('`saveEvent` works', (t) => {
  t.plan(1);

  saveEvent(client, newEvent, (error, result) => {
    t.equal(error, null, 'runs without errors');
  });
});

test('`saveEvent` handles errors', (t) => {
  t.plan(1);

  saveEvent(client, {}, (error, result) => {
    t.ok(error instanceof Error, 'handles an empty event object');
  });
});
