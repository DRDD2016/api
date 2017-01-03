import test from 'blue-tape';
import client from '../../../src/db/client';
import saveUser from '../../../src/lib/auth/save-user';
import { newUser } from '../../utils/fixtures';

test('`saveUser` works', () => {
  return saveUser(client, newUser);
});

test('`saveUser` handles errors', (t) => {
  return t.shouldFail(saveUser(client, {}), 'Promise rejects');
});
