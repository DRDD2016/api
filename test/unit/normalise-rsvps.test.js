import test from 'blue-tape';
import normaliseRsvps from '../../src/lib/normalise-rsvps';

test('`normaliseRsvps` works', (t) => {
  t.plan(1);
  const rsvps = {
    going: [{ firstname: 'Bob' }],
    not_going: [{ firstname: 'Anna' }]
  };

  const expected = { ...rsvps, maybe: [], not_responded: [] };
  const actual = normaliseRsvps(rsvps);
  t.deepEqual(actual, expected);
});
