import query from '../../db/query';
import { updateUserUpdateNo as queryText } from '../../db/sql-queries.json';

/**
 * updateUserupdateNo updates user update_no in the database
 * @param {object} client - database client
 * @param {string} user_id - user_id
 * @param {integer} update_no - new update_no
 * @returns {Promise.<object, Error>}
 */

 export default function updateUserUpdateNo (client, user_id, update_no) {

   return new Promise ((resolve, reject) => {

     if (arguments.length !== 3) {
       return reject(new TypeError('`updateUserUpdateNo` requires 3 arguments.  See docs for usage'));
     }
     if (!update_no) {
       return reject(new TypeError('`updateUserUpdateNo` update_no is undefined'));
     }

    const queryValues = [user_id, update_no];

     query(client, queryText, queryValues, (err, result) => {
       if (err) {
         reject(err);
       }
       if (result.length === 0) {
          resolve(null);
       } else {
          resolve(result[0]);
       }
     });
   });
 }
