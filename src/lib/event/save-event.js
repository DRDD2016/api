import query from '../../db/query';
import SQLqueries from '../../db/sql-queries.json';

/**
 * Save an event to the database
 * @returns {Promise.<void, Error>}
 * @param {object} client - database client
 * @param {object} data - event data
 */

export default function saveEvent (client, data) {

  const queryText = SQLqueries.saveEvent;
  const queryValues = [
    data.host_user_id,
    data.name,
    data.description,
    data.note,
    data._what,
    data._where,
    data._when,
    data._invitees,
    data.is_poll
  ];

  return new Promise((resolve, reject) => {
    query(client, queryText, queryValues, (error) => {
      if (error) {
        reject(error);
      }
      resolve();
    });
  });
}
