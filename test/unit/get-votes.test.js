import test from 'blue-tape';
import client from '../../src/db/client';
import getVotes, { buildGetVotesQuery } from '../../src/lib/events/get-votes';
const initDb = require('../utils/init-db')(client);

const event_id = 1;

test('`getVotes` works', (t) => {
  initDb()
  .then(() => {
    t.plan(1);
    const categoryOptions = {
      _what: 2,
      _where: 2,
      _when: 2
    };
    const expected = {
      "what": [1,2],
      "where": [1,1],
      "when": [2,1]
    };
    getVotes(client, event_id, categoryOptions)
    .then((result) => {
      // some stuff
      t.deepEqual(result, expected);
    });
  });
});

test('`getVotes` handles errors', (t) => {
  return initDb()
  .then(() => t.shouldFail(getVotes(client, ''), 'Promise rejects'));
});

test('`buildGetVotesQuery` works', (t) => {
  t.plan(1);
  initDb()
  .then(() => {

    const expectedQueryText = 'SELECT row_to_json(votes) AS votes FROM (SELECT ARRAY[SUM(_what[1]), SUM(_what[2])] AS what, ARRAY[SUM(_where[1]), SUM(_where[2])] AS where, ARRAY[SUM(_when[1]), SUM(_when[2])] AS when FROM votes WHERE event_id = $1) AS votes;';
    const queryStructure = {
      _what: 2,
      _where: 2,
      _when: 2
    };
    const result = buildGetVotesQuery(event_id, queryStructure);

    t.equal(result, expectedQueryText, 'Returns valid SQL query');
  });
});
