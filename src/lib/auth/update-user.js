import query from '../../db/query';
import { updateUser as queryText } from '../../db/sql-queries.json';

/**
 * updateUser saves user data to the database
 * @param {object} client - database client
 * @param {string} user_id - user_id
 * @param {object} userData - updated user data
 *                                  @param {string} firstname - firstname
 *                                  @param {string} surname - surname
 * @returns {Promise.<void, Error>}
 */

 export default function updateUser (client, user_id, userData) {

   return new Promise ((resolve, reject) => {

     if (arguments.length !== 3) {
       return reject(new TypeError('`updateUser` requires 3 arguments.  See docs for usage'));
     }
     if (!userData || Object.keys(userData).length === 0) {
       return reject(new TypeError('`updateUser` userData is empty or undefined'));
     }

    const queryValues = [user_id, userData.firstname, userData.surname];

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
