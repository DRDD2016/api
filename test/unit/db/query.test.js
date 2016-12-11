import test from 'tape';
import query from '../../../db/query';
import client from '../../../db/client';

test('`query` handles invalid SQL query', (t) => {
  t.plan(1);

  query(client, 'WRONG * FROM users WHERE user_id = $1;', [1], (error, result) => {
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
