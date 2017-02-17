import query from '../../db/query';
import { updateUserPhoto as queryText } from '../../db/sql-queries.json';

/**
 * updateUserPhoto updates user photo url in the database
 * @param {object} client - database client
 * @param {string} user_id - user_id
 * @param {string} filename - new photo_url
 * @returns {Promise.<object, Error>}
 */

 export default function updateUserPhoto (client, user_id, filename) {

   return new Promise ((resolve, reject) => {

     if (arguments.length !== 3) {
       return reject(new TypeError('`updateUserPhoto` requires 3 arguments.  See docs for usage'));
     }
     if (!filename) {
       return reject(new TypeError('`updateUserPhoto` filename is undefined'));
     }

    const queryValues = [user_id, filename];

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
