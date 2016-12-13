import test from 'blue-tape';
import query from '../../../src/db/query';
import client from '../../../src/db/client';

test('`query` handles invalid SQL query', (t) => {
  t.plan(1);

  query(client, 'WRONG * FROM users WHERE user_id = $1;', [1], (error) => {
    t.ok(error instanceof Error);
  });
});

test('`query` works', (t) => {
  t.plan(2);

  query(client, 'SELECT * FROM users WHERE user_id = $1;', [1], (error, result) => {
    t.notOk(error);
    t.ok(Array.isArray(result));
  });
});

test('`query` handles errors', (t) => {
  t.plan(1);
  const queryText = 'SELECT * FROM users WHERE user_id = $1;';

  try {
    query(client, queryText, () => {});
  } catch (error) {
    t.ok(error instanceof Error, 'handles incorrect number of arguments');
  }
});
