import test from 'blue-tape';
import client from '../../../src/db/client';
import updateUserPhoto from '../../../src/lib/auth/update-user-photo';
const initDb = require('../../utils/init-db')(client);

const user_id = 1;

test.only('`updateUserPhoto` works', (t) => {
  // t.plan(2);
  initDb()
  .then(() => {
    const filename = 'userPicture.jpg';
    updateUserPhoto(client, user_id, filename)
    .then((result) => {
      console.log('result test', result);
      t.end();
    })
    .catch(err => console.error(err));
  });

});

test('`updateUserPhoto` handles errors', (t) => {
  return initDb()
  .then(() => t.shouldFail(updateUserPhoto(client, ""), 'handles missing arguments'));
});
