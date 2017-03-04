import test from 'blue-tape';
import client from '../../src/db/client';
import getVote, { buildGetVoteQuery } from '../../src/lib/events/get-vote';
const initDb = require('../utils/init-db')(client);


test('`getVote` works', (t) => {
  initDb()
  .then(() => {
    t.plan(1);

    const user_id = 2;
    const event_id = 1;
    const categoryOptions = {
      _what: 2,
      _where: 2,
      _when: 2
    };
    const expected = {
      "what": [0, 1],
      "where": [1, 0],
      "when": [1, 1]
    };
    getVote(client, user_id, event_id, categoryOptions)
    .then((result) => {
      t.deepEqual(result, expected);
    });
  });
});

test('`getVote` handles event with no votes', (t) => {
  initDb()
  .then(() => {
    t.plan(1);

    const user_id = 2;
    const event_id = 2;
    const categoryOptions = {
      _what: 2,
      _where: 2
    };
    const expected = {
      "what": [0, 0],
      "where": [0, 0]
    };
    getVote(client, user_id, event_id, categoryOptions)
    .then((result) => {
      t.deepEqual(result, expected);
    });
  });
});

test('`getVote` handles errors', (t) => {
  return initDb()
  .then(() => t.shouldFail(getVote(client, ''), 'Promise rejects'));
});

test('`buildGetVoteQuery` works', (t) => {
  t.plan(1);
  initDb()
  .then(() => {

    const user_id = 3;
    const event_id = 1;
    const expectedQueryText = 'SELECT row_to_json(vote) AS vote FROM (SELECT ARRAY[COALESCE(SUM(_what[1]), 0), COALESCE(SUM(_what[2]), 0)] AS what, ARRAY[COALESCE(SUM(_where[1]), 0), COALESCE(SUM(_where[2]), 0)] AS where, ARRAY[COALESCE(SUM(_when[1]), 0), COALESCE(SUM(_when[2]), 0)] AS when FROM votes WHERE user_id = $1 AND event_id = $2) AS vote;';
    const queryStructure = {
      _what: 2,
      _where: 2,
      _when: 2
    };
    buildGetVoteQuery(user_id, event_id, queryStructure, (err, result) => {

      t.equal(result, expectedQueryText, 'Returns valid SQL query');
    });
  });
});
