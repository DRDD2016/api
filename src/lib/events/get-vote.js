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
    const queryText = 'SELECT _what AS what, _where AS where, _when AS when FROM votes WHERE user_id = $1 AND event_id = $2;';
    const queryValues = [parseInt(user_id, 10), parseInt(event_id, 10)];

    query(client, queryText, queryValues, (err, result) => {
      if (err) {
        return reject(err);
      }
      console.log('IS THIS NULL?', result);
      if (result.length === 0) {
        const initialState = {};

        categoryOptions._what && (initialState.what = new Array(categoryOptions._what).fill(0));
        categoryOptions._where && (initialState.where = new Array(categoryOptions._where).fill(0));
        categoryOptions._when && (initialState.when = new Array(categoryOptions._when).fill(0));
        console.log('Result from getVote', initialState);
        return resolve(initialState);
      } else {
        const vote = result[0];
        const keysInResult = Object.keys(vote);
        for (let i = 0; i < keysInResult.length; i++) {
          if (!categoryOptions.hasOwnProperty(`_${keysInResult[i]}`)) {
            delete vote[keysInResult[i]];
          }
          if (i === keysInResult.length - 1) {
            console.log('Result from getVote', vote);
            return resolve(vote);
          }
        }
      }
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
