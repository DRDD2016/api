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

    buildGetAllVotesQuery(event_id, categoryOptions, (err, queryText) => {

      const queryValues = [event_id];
      console.log(queryText);
      query(client, queryText, queryValues, (err, result) => {
        if (err) {
          reject(err);
        }
        console.log('VOTES??', result);
        return result ?
        resolve(result[0].votes) :
        reject(null);
      });
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
