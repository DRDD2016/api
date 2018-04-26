import query from '../../db/query';
import { updateUserOpenNo as queryText } from '../../db/sql-queries.json';

/**
 * updateUseropenNo updates user open_no in the database
 * @param {object} client - database client
 * @param {string} user_id - user_id
 * @param {integer} open_no - new open_no
 * @returns {Promise.<object, Error>}
 */

 export default function updateUserOpenNo (client, user_id, open_no) {

   return new Promise ((resolve, reject) => {

     if (arguments.length !== 3) {
       return reject(new TypeError('`updateUserOpenNo` requires 3 arguments.  See docs for usage'));
     }
     if (!open_no) {
       return reject(new TypeError('`updateUserOpenNo` open_no is undefined'));
     }

    const queryValues = [user_id, open_no];

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
