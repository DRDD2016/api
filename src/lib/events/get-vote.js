import query from '../../db/query';

/**
 * getVote gets the vote for an event
 * @returns {Promise.<object, Error>}
 * @param {object} client - database client
 * @param {string} user_id - user_id
 * @param {string} event_id - event_id
 * @param {object} categoryOptions - key: categories with votable options, value: number of votable options. Categories with no options are omitted. e.g. { _what: 2, _when: 3 }
 */

export default function getVote (client, user_id, event_id, categoryOptions) {
  return new Promise ((resolve, reject) => {

    if (arguments.length !== 4) {
      return reject(new TypeError('`getVote` requires 4 arguments.  See docs for usage'));
    }
    if (!user_id) {
      return reject(new TypeError('`getVote` user_id is null or undefined'));
    }
    if (!event_id) {
      return reject(new TypeError('`getVote` event_id is null or undefined'));
    }
    if (!categoryOptions || Object.keys(categoryOptions).length === 0) {
      return reject(new TypeError('`getVote` categoryOptions is empty or undefined'));
    }

    buildGetVoteQuery(user_id, event_id, categoryOptions, (err, queryText) => {

      const queryValues = [user_id, event_id];
      query(client, queryText, queryValues, (err, result) => {
        if (err) {
          reject(err);
        }
        return result ?
        resolve(result[0].vote) :
        reject(null);
      });
    });
  });
}

/**
 * buildGetVoteQuery creates a valid SQL query for `getVote`
 * @param {string} user_id - user_id
 * @param {string} event_id - event_id
 * @param {object} categoryOptions - key: categories with votable options, value: number of votable options. Categories with no options are omitted. e.g. { _what: 2, _when: 3 }
 * @param {function} callback
 * @returns {string} - query
 */


export function buildGetVoteQuery (user_id, event_id, categoryOptions, callback) {
  const categories = Object.keys(categoryOptions);

  const arrayStringObj = categories.reduce((acc, category) => {
    let sumText;

    if (categoryOptions[category] === 2) {
      sumText = `COALESCE(SUM(${category}[${categoryOptions[category] - 1}]), 0), COALESCE(SUM(${category}[${categoryOptions[category]}]), 0)`;
    }
    if (categoryOptions[category] === 3) {
      sumText = `COALESCE(SUM(${category}[${categoryOptions[category] - 2}], 0), COALESCE(SUM(${category}[${categoryOptions[category] - 1}]), 0), COALESCE(SUM(${category}[${categoryOptions[category]}]), 0)`;
    }
    acc[category] = sumText;
    return acc;
  }, {});

  const text = categories.reduce((acc, category, i) => {
    acc += `ARRAY[${arrayStringObj[category]}] AS ${category.substr(1)}`;
    if (i !== categories.length - 1) {
      acc += ', ';
    }
    return acc;
  }, '');

  const queryText = `SELECT row_to_json(vote) AS vote FROM (SELECT ${text} FROM votes WHERE user_id = $1 AND event_id = $2) AS vote;`;
  return callback(null, queryText);
}
