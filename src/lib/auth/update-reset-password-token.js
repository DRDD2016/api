import query from '../../db/query';
import { updateResetToken as queryText } from '../../db/sql-queries.json';

/**
 * updateResetPasswordToken updates user with resetPasswordToken and resetPasswordExpires
 * @param {object} client - database client
 * @param {string} user_id - user_id
 * @param {string} resetPasswordToken - random uniqu string
 * @param {date} resetPasswordExpires - expire date for the token
 * @returns {Promise.<Object, Error>}
 */

 export default function updateResetPasswordToken (client, user_id, resetPasswordToken, resetPasswordExpires) {
   return new Promise ((resolve, reject) => {

     if (arguments.length !== 4) {
       return reject(new TypeError('`updateResetPasswordToken` requires 3 arguments.  See docs for usage'));
     }
     if (!resetPasswordToken) {
       return reject(new TypeError('`updateResetPasswordToken` resetPasswordToken is undefined'));
     }
     if (!resetPasswordExpires) {
      return reject(new TypeError('`updateResetPasswordToken` resetPasswordExpires is undefined'));
     }

    const queryValues = [user_id, resetPasswordToken, resetPasswordExpires];

     query(client, queryText, queryValues, (err, result) => {
       if (err) {
         reject(err);
       }
       if (result.length === 0) {
         return resolve(false);
       }
       return resolve(result[0]);
     });
   });
 }
