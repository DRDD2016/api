import test from 'blue-tape';
import client from '../../../src/db/client';
import saveUser from '../../../src/lib/auth/save-user';
import { newUser } from '../../utils/fixtures';

test('`saveUser` works', (t) => {
  return saveUser(client, newUser)
    .then((user) => {
      t.ok(
        ['firstname', 'surname', 'email', 'user_id'].every((key) => {
          return user.hasOwnProperty(key);
        }),
        '`saveUser` contains expected properties'
      );
    });
});

test('`saveUser` handles errors', (t) => {
  return t.shouldFail(saveUser(client, ""), 'Promise rejects');
});
