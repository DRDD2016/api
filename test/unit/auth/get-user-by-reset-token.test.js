import test from 'blue-tape';
import client from '../../../src/db/client';
import getUserByResetToken from '../../../src/lib/auth/get-user-by-reset-token';
import { existingUserWithToken } from '../../utils/fixtures';

test('`getUserByResetToken` works', (t) => {
  t.plan(2);

  getUserByResetToken(client, 'somewrongtoken')
    .then((userExists) => {
      t.equal(userExists, false, 'returns false when user not found');
    });

  getUserByResetToken(client, existingUserWithToken.reset_password_token)
    .then((userExists) => {
      t.equal(userExists.user_id, existingUserWithToken.user_id, 'correct user retrieved');
    });
});
