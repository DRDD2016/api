import test from 'blue-tape';
import client from '../../../src/db/client';
import updateResetPasswordToken from '../../../src/lib/auth/update-reset-password-token';
const initDb = require('../../utils/init-db')(client);

const user_id = 1;

test('`updateResetPasswordToken` works', (t) => {
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
    updateResetPasswordToken(client, user_id, resetPasswordToken, resetPasswordExpires)
    .then((result) => {
      t.deepEqual(result, expected, 'receives the correct token along with the correct user data');
    })
    .catch(err => console.error(err));
  });

});

test('`updateResetPasswordToken` handles errors', (t) => {
  return initDb()
  .then(() => t.shouldFail(updateResetPasswordToken(client, ""), 'handles missing arguments'));
});
