import test from 'blue-tape';
import client from '../../src/db/client';
import getEventByCode from '../../src/lib/events/get-event-by-code';
import { event_1 } from '../utils/fixtures';
const initDb = require('../utils/init-db')(client);

const code = 'FAKECODE';

test('`getEventByCode` works', (t) => {
  t.plan(3);
  initDb()
  .then(() => {

    const expected = event_1;
    getEventByCode(client, code)
    .then((result) => {
      t.equal(result.event_id, expected.event_id, 'correct event retrieved');
      t.ok(result.host_photo_url, 'Event includes host photo url');
    })
    .catch(err => console.error(err));

    getEventByCode(client, 'WRONGCODE')
    .then((result) => {
      t.notOk(result, 'handles non-existent code');
    });
  });
});

test('`getEventByCode` handles errors', (t) => {
  return initDb()
  .then(() => t.shouldFail(getEventByCode(client, ""), 'handles missing code'));
});
