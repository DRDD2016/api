import query from '../../db/query';

/**
 * getAllVotes gets the votes for an event
 * @returns {Promise.<object, Error>}
 * @param {object} client - database client
 * @param {string} event_id - event_id
 * @param {object} categoryOptions - key: categories with votable options, value: number of votable options. Categories with no options are omitted. e.g. { _what: 2, _when: 3 }
 */

export default function getAllVotes (client, event_id, categoryOptions) {
  console.log('get votes options', categoryOptions);
  return new Promise ((resolve, reject) => {

    if (arguments.length !== 3) {
      return reject(new TypeError('`getAllVotes` requires 3 arguments.  See docs for usage'));
    }
    if (!event_id) {
      return reject(new TypeError('`getAllVotes` event_id is null or undefined'));
    }
    if (!categoryOptions || Object.keys(categoryOptions).length === 0) {
      return reject(new TypeError('`getAllVotes` categoryOptions is empty or undefined'));
    }

    const queryText = 'SELECT _what as what, _where as where, _when as when FROM votes WHERE event_id = $1;';
    const queryValues = [event_id];
    // console.log(queryText);
    query(client, queryText, queryValues, (err, result) => {
      if (err) {
        return reject(err);
      }
      if (!result) {
        return resolve(null);
      }
      console.log('VOTES??', result);

      const initialState = {};
      categoryOptions._what && (initialState.what = new Array(categoryOptions._what).fill(0));
      categoryOptions._where && (initialState.where = new Array(categoryOptions._where).fill(0));
      categoryOptions._when && (initialState.when = new Array(categoryOptions._when).fill(0));
      console.log(initialState, 'lllllll');

      (function fakeReduce (acc, votes) {
        if (votes.length === 0) {
          console.log('FINAL', acc);
          return resolve(acc);
        }
        if (acc.what) {
          acc.what[0] += votes[0].what[0];
          acc.what[1] += votes[0].what[1];
          if (acc.what.length == 3) {
            acc.what[2] += votes[0].what[2];
          }
        }
        if (acc.where) {
          acc.where[0] += votes[0].where[0];
          acc.where[1] += votes[0].where[1];
          if (acc.where.length == 3) {
            acc.where[2] += votes[0].where[2];
          }
        }
        if (acc.when) {
          acc.when[0] += votes[0].when[0];
          acc.when[1] += votes[0].when[1];
          if (acc.when.length == 3) {
            acc.when[2] += votes[0].when[2];
          }
        }
        fakeReduce(acc, votes.slice(1));
      }(initialState, result));
    });
  });
}

/**
 * buildGetAllVotesQuery creates a valid SQL query for `getAllVotes`
 * @param {string} event_id - event_id
 * @param {object} categoryOptions - key: categories with votable options, value: number of votable options. Categories with no options are omitted. e.g. { _what: 2, _when: 3 }
 * @param {function} callback
 * @returns {string} - query
 */


export function buildGetAllVotesQuery (event_id, categoryOptions, callback) {
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

  const queryText = `SELECT row_to_json(votes) AS votes FROM (SELECT ${text} FROM votes WHERE event_id = $1) AS votes;`;
  return callback(null, queryText);
}
