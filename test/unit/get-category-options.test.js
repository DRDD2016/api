import test from 'blue-tape';
import client from '../../src/db/client';
import getCategoryOptions from '../../src/lib/events/get-category-options';
const initDb = require('../utils/init-db')(client);


test('`getCategoryOptions` works', (t) => {
  t.plan(1);
  initDb()
  .then(() => {
    const event_id = 1;
    const expected = {
      _what: 2,
      _where: 2,
      _when: 2
    };
    getCategoryOptions(client, event_id)
      .then((result) => {
        t.deepEqual(result, expected, 'Correct category options');
      });
  });
});

test('`getCategoryOptions` works when only 2 categories have options', (t) => {
  t.plan(1);
  initDb()
  .then(() => {
    const event_id = 2;
    const expected = {
      _what: 2,
      _where: 2
    };
    getCategoryOptions(client, event_id)
      .then((result) => {
        t.deepEqual(result, expected, 'Correct category options');
      });
  });
});

test('`getCategoryOptions` removes categories with only 1 option', (t) => {
  t.plan(1);
  initDb()
  .then(() => {
    const event_id = 3;
    const expected = {};
    getCategoryOptions(client, event_id)
      .then((result) => {
        t.deepEqual(result, expected, 'Correct category options');
      });
  });
});

test('`getCategoryOptions` handles wrong number of arguments', (t) => {
  return initDb()
  .then(() => t.shouldFail(getCategoryOptions(client), 'Promise rejects'));
});
