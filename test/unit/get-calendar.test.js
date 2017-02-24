import test from 'blue-tape';
import client from '../../src/db/client';
import getCalendar from '../../src/lib/events/get-calendar';
import { calendar_user_3 } from '../utils/fixtures';
const initDb = require('../utils/init-db')(client);

test('`getCalendar` works', (t) => {
  t.plan(2);
  initDb()
  .then(() => {

    const user_id = 3;
    const expected = calendar_user_3;
    getCalendar(client, user_id)
    .then((result) => {
      t.deepEqual(result, expected, 'correct calendar retrieved');
    })
    .catch((err) => {
      console.error(err);
    });

    getCalendar(client, 99)
    .then((result) => {
      t.notOk(result, 'handles non-existent user_id');
    })
    .catch((err) => {
      console.error(err);
    });
  });

});

test('`getCalendar` handles errors', (t) => {
  return initDb()
  .then(() => t.shouldFail(getCalendar(client, ""), 'handles missing user_id'));
});
