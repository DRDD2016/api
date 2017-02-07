import query from '../../db/query';

/**
 * saveVote saves an invitee's vote to the database
 * @returns {Promise.<void, Error>}
 * @param {object} client - database client
 * @param {string} user_id - user_id
 * @param {string} event_id - event_id
 * @param {object} vote - vote object
 */

export default function saveVote (client, user_id, event_id, vote) {

  return new Promise ((resolve, reject) => {

    if (arguments.length !== 4) {
      return reject(new TypeError('`saveVote` requires 4 arguments.  See docs for usage'));
    }
    if (!vote || Object.keys(vote).length === 0) {
      return reject(new TypeError('`saveVote` vote data is empty or undefined'));
    }

    const { queryText, queryValues } = buildSaveVoteQuery(user_id, event_id, vote);

    query(client, queryText, queryValues, (err) => {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
}

/**
 * buildSaveVoteQuery creates a valid SQL query for `saveVote`
 * @param {string} user_id - user id
 * @param {string} event_id - event_id
 * @param {object} vote - vote object
 * @returns {object} - object containing
 *                     {string} - SQL query text,
 *                     {array} - query values
 */

export function buildSaveVoteQuery (user_id, event_id, vote) {

  const result = Object.keys(vote).map((category) => {
    return {
      category: `_${category}`,
      value: `{${vote[category].toString()}}`
    };
  });
  const columns = result.map((categoryObj) => {
    return categoryObj.category;
  }).join(', ');
  const insertValues = result.map((categoryObj, i) => {
    return `$${i + 3}`;
  }).join(', ');
  const setValues = result.map((categoryObj, i) => {
    return `${categoryObj.category} = $${i + 3}`;
  }).join(', ');

  const queryText = `INSERT INTO votes (user_id, event_id, ${columns}) VALUES ($1, $2, ${insertValues}) ON CONFLICT (user_id, event_id) DO UPDATE SET ${setValues} WHERE votes.user_id = $1 AND votes.event_id = $2;`;
  const queryValues = result.map((categoryObj) => {
    return categoryObj.value;
  });
  return {
    queryText,
    queryValues: [user_id, event_id].concat(queryValues)
  };
}
