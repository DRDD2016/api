import test from 'blue-tape';
import client from '../../../src/db/client';
import updateUserResetPassword from '../../../src/lib/auth/update-user-reset-password-token';
const initDb = require('../../utils/init-db')(client);

const user_id = 1;

test('`updateUserResetPassword` works', (t) => {
  t.plan(1);
  initDb()
  .then(() => {
    const resetPasswordToken =  'someuniquestring';
    const resetPasswordExpires = Date.now() + 3600000; // 1h
    const expected = {
      firstname: 'Anita',
      email: 'anita@spark.com',
      reset_password_token: 'someuniquestring'
    };
    updateUserResetPassword(client, user_id, resetPasswordToken, resetPasswordExpires)
    .then((result) => {
      t.deepEqual(result, expected, 'receives the correct token along with the correct user data');
    })
    .catch(err => console.error(err));
  });

});

test('`updateUserResetPassword` handles errors', (t) => {
  return initDb()
  .then(() => t.shouldFail(updateUserResetPassword(client, ""), 'handles missing arguments'));
});
