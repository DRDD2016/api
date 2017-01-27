import test from 'blue-tape';
import client from '../../src/db/client';
import getEventByCode from '../../src/lib/events/get-event-by-code';
import { event_1 } from '../utils/fixtures';


const code = 'FAKECODE';

test('`getEventByCode` works', (t) => {
  t.plan(2);

  const expected = event_1;
  getEventByCode(client, code)
    .then((result) => {
      t.deepEqual(result, expected, 'correct event retrieved');
    })
    .catch(err => console.error(err));

  getEventByCode(client, 'WRONGCODE')
    .then((result) => {
      t.notOk(result, 'handles non-existent code');
    });
});

test('`getEventByCode` handles errors', (t) => {
  return t.shouldFail(getEventByCode(client, ""), 'handles missing code');
});
