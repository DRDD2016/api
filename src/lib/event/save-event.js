import query from '../../db/query';
import SQLqueries from '../../db/sql-queries.json';

export default function saveEvent (client, data, callback) {

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

  query(client, queryText, queryValues, (error, result) => {
    if (error) {
      return callback(error);
    }
    return callback(null, result);
  });
}
