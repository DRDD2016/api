import query from '../../db/query';
import { updateUserResetPasswordToken as queryText } from '../../db/sql-queries.json';

/**
 * updateUserResetPasswordToken updates user with resetPasswordToken and resetPasswordExpires
 * @param {object} client - database client
 * @param {string} user_id - user_id
 * @param {string} resetPasswordToken - random uniqu string
 * @param {date} resetPasswordExpires - expire date for the token
 * @returns {Promise.<object, Error>}
 */

 export default function updateUserResetPasswordToken (client, user_id, resetPasswordToken, resetPasswordExpires) {
    console.log(resetPasswordToken, resetPasswordExpires, user_id);
   return new Promise ((resolve, reject) => {

     if (arguments.length !== 4) {
       return reject(new TypeError('`updateUserResetPasswordToken` requires 3 arguments.  See docs for usage'));
     }
     if (!resetPasswordToken) {
       return reject(new TypeError('`updateUserResetPasswordToken` resetPasswordToken is undefined'));
     }
     if (!resetPasswordExpires) {
      return reject(new TypeError('`updateUserResetPasswordToken` resetPasswordExpires is undefined'));
     }

    const queryValues = [user_id, resetPasswordToken, resetPasswordExpires];

     query(client, queryText, queryValues, (err, result) => {
       if (err) {
         reject(err);
       }
       console.log('result', result);

       resolve(result);
     });
   });
 }
