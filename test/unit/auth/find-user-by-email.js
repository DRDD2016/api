import test from 'blue-tape';
import client from '../../../src/db/client';
import findUserByEmail from '../../../src/lib/auth/find-user-by-email';
import { newUser } from '../../utils/fixtures';

test('`findUserByEmail` works', (t) => {
  t.plan(2);

  findUserByEmail(client, newUser.email)
    .then((userExists) => {
      t.equal(userExists, false, 'returns false when user not found');
    });

  findUserByEmail(client, 'anita@spark.com')
    .then((userExists) => {
      t.ok(userExists, 'returns user data');
    });
});

test('`findUserByEmail` handles errors', (t) => {
  return t.shouldFail(findUserByEmail(client, ""), 'handles missing email');
});
