import query from '../../db/query';
import { resetUserPassword as queryText } from '../../db/sql-queries.json';
import hashPassword from './hash-password';

/**
 * resetUserPassword updates user with new password
 * @param {object} client - database client
 * @param {string} user_id - user_id
 * @param {string} password - new password
 * @returns {Promise.<Boolean, Error>}
 */

 export default function resetUserPassword (client, user_id, password) {

   return new Promise((resolve, reject) => {

      if (arguments.length !== 3) {
       return reject(new TypeError('`resetUserPassword` requires 3 arguments.  See docs for usage'));
     }
     if (!password) {
       return reject(new TypeError('`resetUserPassword` password is undefined'));
     }

     hashPassword(password)
       .then((hash) => {
         const queryValues = [
           user_id,
           hash
         ];
         query(client, queryText, queryValues, (err, data) => {
           if (err) {
             return reject(err);
           }
           console.log('data', data);
           return resolve(true);
         });
       })
       .catch(err => reject(err));
   });
 }
