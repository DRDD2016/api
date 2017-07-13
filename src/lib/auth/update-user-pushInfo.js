import query from '../../db/query';
import { updateUserPushInfo as queryText } from '../../db/sql-queries.json';

/**
 * updateUserPhoto updates user photo url in the database
 * @param {object} client - database client
 * @param {string} user_id - user_id
 * @param {string} pushInfo - new pushInfo
 * @returns {Promise.<object, Error>}
 */

 export default function updateUserPushInfo (client, user_id, pushInfo) {

   return new Promise ((resolve, reject) => {

     if (arguments.length !== 3) {
       return reject(new TypeError('`updateUserPushInfo` requires 3 arguments.  See docs for usage'));
     }
     if (!pushInfo) {
       return reject(new TypeError('`updateUserPushInfo` pushInfo is undefined'));
     }

    const queryValues = [user_id, pushInfo];

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
