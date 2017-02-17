import test from 'blue-tape';
import client from '../../../src/db/client';
import updateUserPhoto from '../../../src/lib/auth/update-user-photo';
const initDb = require('../../utils/init-db')(client);

const user_id = 1;

test('`updateUserPhoto` works', (t) => {
  t.plan(1);
  initDb()
  .then(() => {
    const filename =  'userPicture.jpg';
    const expected = { photo_url: filename };
    updateUserPhoto(client, user_id, filename)
    .then((result) => {
      t.deepEqual(result, expected, 'receives the correct photo_url');
    })
    .catch(err => console.error(err));
  });

});

test('`updateUserPhoto` handles errors', (t) => {
  return initDb()
  .then(() => t.shouldFail(updateUserPhoto(client, ""), 'handles missing arguments'));
});
