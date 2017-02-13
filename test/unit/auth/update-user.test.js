import test from 'blue-tape';
import client from '../../../src/db/client';
import updateUser from '../../../src/lib/auth/update-user';
import { userData } from '../../utils/fixtures';
const initDb = require('../../utils/init-db')(client);

const user_id = 1;

test('`updateUser` works', (t) => {
  t.plan(2);
  initDb()
  .then(() => {

    updateUser(client, user_id, userData)
    .then((result) => {
      t.equal(result.firstname, userData.firstname, 'user firstname updated correctly');
      t.equal(result.surname, userData.surname, 'user surname updated correctly');
    })
    .catch(err => console.error(err));
  });

});

test('`updateUser` handles errors', (t) => {
  return initDb()
  .then(() => t.shouldFail(updateUser(client, ""), 'handles missing arguments'));
});
