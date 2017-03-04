import test from 'blue-tape';
import client from '../../../src/db/client';
import getUserById from '../../../src/lib/auth/get-user-by-id';
import { existingUser } from '../../utils/fixtures';

test('`getUserById` works', (t) => {
  t.plan(2);

  getUserById(client, '99')
    .then((userExists) => {
      t.equal(userExists, false, 'returns false when user not found');
    });

  getUserById(client, existingUser.user_id)
    .then((userExists) => {
      t.ok(userExists, 'returns user data');
    });
});

test('`getUserById` handles errors', (t) => {
  return t.shouldFail(getUserById(client, ""), 'Promise rejects');
});
