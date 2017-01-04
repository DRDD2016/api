import query from '../../db/query';
import SQLqueries from '../../db/sql-queries.json';

/**
 * Save a user to the database
 * @returns {Promise.<void, Error>}
 * @param {object} client - database client
 * @param {object} user data - email, password, firstname, surname
 */

export default function saveUser (client, data) {
  return new Promise((resolve, reject) => {
    if (!data) return reject(new TypeError('`saveUser` user data is empty or undefined'));

    const queryText = SQLqueries.saveUser;
    const queryValues = [
      data.firstname,
      data.surname,
      data.email,
      data.password
    ];
    query(client, queryText, queryValues, (err, data) => {
      if (err) {
        reject(err);
      }
    
      resolve(data[0].user_id);
    });
  });
}
