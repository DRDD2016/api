import test from 'blue-tape';
import client from '../../src/db/client';
import query from '../../src/db/query';
import saveVote, { buildSaveVoteQuery } from '../../src/lib/events/save-vote';
import { vote } from '../utils/fixtures';
const initDb = require('../utils/init-db')(client);

const user_id = 3;
const event_id = 1;

test('`saveVote` works', () => {
  return initDb()
  .then(() => saveVote(client, user_id, event_id, vote));
});

test('`saveVote` fully replaces a previous vote', (t) => {
  t.plan(1);
  initDb()
  .then(() => {

    const newVote = {
      what: [1, 0],
      where: [1, 1],
      when: [0, 1]
    };

    saveVote(client, user_id, event_id, vote)
    .then(() => {
      saveVote(client, user_id, event_id, newVote)
      .then(() => {

        const queryText = 'SELECT _what AS what, _where AS where, _when AS when FROM votes WHERE user_id = $1 AND event_id = $2;';
        query(client, queryText, [3, 1], (err, result) => {

          t.deepEqual(result[0], newVote, 'new vote values have replaced the old ones');
        });
      });
    });
  });
});

test('`saveVote` handles errors', (t) => {
  return initDb()
  .then(() => t.shouldFail(saveVote(client, user_id, event_id, {}), 'Promise rejects'));
});

test('`buildSaveVoteQuery` works', (t) => {
  t.plan(2);
  initDb()
  .then(() => {

    const expectedText = 'INSERT INTO votes (user_id, event_id, _what, _where, _when) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (user_id, event_id) DO UPDATE SET _what = $3, _where = $4, _when = $5 WHERE votes.user_id = $1 AND votes.event_id = $2;';

    const expectedValues = [user_id, event_id, '{0,1}', '{1,1}', '{1,0}'];
    const result = buildSaveVoteQuery(user_id, event_id, vote);

    t.equal(result.queryText, expectedText, 'Returns valid SQL query');
    t.deepEqual(result.queryValues, expectedValues, 'Returns query values in correct SQL array format');
  });
});

test('`buildSaveVoteQuery` works when only some categories have options', (t) => {
  t.plan(2);
  initDb()
  .then(() => {

    const event_id = 1;
    const voteWithTwoCategories = {
      what: [1, 1],
      where: [0, 1]
    };

    const expectedText = 'INSERT INTO votes (user_id, event_id, _what, _where) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, event_id) DO UPDATE SET _what = $3, _where = $4 WHERE votes.user_id = $1 AND votes.event_id = $2;';

    const expectedValues = [user_id, event_id, '{1,1}', '{0,1}'];
    const result = buildSaveVoteQuery(user_id, event_id, voteWithTwoCategories);

    t.equal(result.queryText, expectedText, 'Returns valid SQL query');
    t.deepEqual(result.queryValues, expectedValues, 'Returns query values in correct SQL array format');
  });
});
