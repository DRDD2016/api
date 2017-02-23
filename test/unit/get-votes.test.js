import test from 'blue-tape';
import client from '../../src/db/client';
import getVotes, { buildGetVotesQuery } from '../../src/lib/events/get-votes';
const initDb = require('../utils/init-db')(client);


test('`getVotes` works', (t) => {
  initDb()
  .then(() => {
    t.plan(1);

    const event_id = 1;
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

test('`getVotes` handles events with no votes', (t) => {
  initDb()
  .then(() => {
    t.plan(1);

    const event_id = 2;
    const categoryOptions = {
      _what: 2,
      _where: 2
    };
    const expected = { what: [ 0, 0 ], where: [ 0, 0 ] };
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

    const event_id = 1;
    const expectedQueryText = 'SELECT row_to_json(votes) AS votes FROM (SELECT ARRAY[COALESCE(SUM(_what[1]), 0), COALESCE(SUM(_what[2]), 0)] AS what, ARRAY[COALESCE(SUM(_where[1]), 0), COALESCE(SUM(_where[2]), 0)] AS where, ARRAY[COALESCE(SUM(_when[1]), 0), COALESCE(SUM(_when[2]), 0)] AS when FROM votes WHERE event_id = $1) AS votes;';
    const queryStructure = {
      _what: 2,
      _where: 2,
      _when: 2
    };
    const result = buildGetVotesQuery(event_id, queryStructure);

    t.equal(result, expectedQueryText, 'Returns valid SQL query');
  });
});
