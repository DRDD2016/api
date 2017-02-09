import test from 'blue-tape';
import client from '../../../src/db/client';
import getUserByEmail from '../../../src/lib/auth/get-user-by-email';
import { newUser } from '../../utils/fixtures';

test('`getUserByEmail` works', (t) => {
  t.plan(2);

  getUserByEmail(client, newUser.email)
    .then((userExists) => {
      t.equal(userExists, false, 'returns false when user not found');
    });

  getUserByEmail(client, 'anita@spark.com')
    .then((userExists) => {
      t.ok(userExists, 'returns user data');
    });
});

test('`getUserByEmail` handles errors', (t) => {
  return t.shouldFail(getUserByEmail(client, ""), 'handles missing email');
});
