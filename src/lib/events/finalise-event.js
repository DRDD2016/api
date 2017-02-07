import query from '../../db/query';
import { finaliseEvent as queryText } from '../../db/sql-queries.json';
import normaliseEventKeys from '../normalise-event-keys';
/**
 * finaliseEvent saves an host's finalised event to the database
 * @param {object} client - database client
 * @param {string} event_id - event_id
 * @param {object} hostEventChoices - final event choices made by host
 *                                  @param {array} what - what category
 *                                  @param {array} when - when category
 *                                  @param {array} where - where category
 * @returns {Promise.<void, Error>}
 */

 export default function finaliseEvent (client, event_id, hostEventChoices) {

   return new Promise ((resolve, reject) => {

     if (arguments.length !== 3) {
       return reject(new TypeError('`finaliseEvent` requires 3 arguments.  See docs for usage'));
     }
     if (!hostEventChoices || Object.keys(hostEventChoices).length === 0) {
       return reject(new TypeError('`finaliseEvent` hostEventChoices data is empty or undefined'));
     }

    const queryValues = [event_id, hostEventChoices.what[0], hostEventChoices.where[0], hostEventChoices.when[0]];

     query(client, queryText, queryValues, (err, result) => {
       if (err) {
         reject(err);
       }
       if (result.length === 0) {
          resolve(null);
       } else {
          resolve(normaliseEventKeys(result[0]));
       }
     });
   });
 }
