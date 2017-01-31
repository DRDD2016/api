import test from 'blue-tape';
import client from '../../src/db/client';
import saveVote, { buildSaveVoteQuery } from '../../src/lib/events/save-vote';

const vote = {
  what: [0, 1],
  where: [1, 1]
};
const user_id = 3;
const event_id = 1;

test('`saveVote` works', () => {
  return saveVote(client, user_id, event_id, vote);
});

test('`saveVote` handles errors', (t) => {
  return t.shouldFail(saveVote(client, user_id, event_id, {}), 'Promise rejects');
});

test('`buildSaveVoteQuery` works', (t) => {
  t.plan(2);

  const expectedText = 'INSERT INTO votes (user_id, event_id, _what, _where) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, event_id) DO UPDATE SET _what = $3, _where = $4 WHERE votes.user_id = $1 AND votes.event_id = $2;';

  const expectedValues = [user_id, event_id, '{0,1}', '{1,1}'];
  const result = buildSaveVoteQuery(user_id, event_id, vote);
  
  t.equal(result.queryText, expectedText, 'Returns valid SQL query');
  t.deepEqual(result.queryValues, expectedValues, 'Returns query values in correct SQL array format');
});
