import test from 'blue-tape';
import normaliseEventKeys from '../../src/lib/normalise-event-keys';

test('`normaliseEventKeys` works', (t) => {
  t.plan(1);

  const event = {
    _invitees: [],
    _what: [],
    _where: [],
    _when: [],
    name: '',
    description: '',
    host_user_id: '',
    is_poll: '',
    note: '',
    event_id: ''
  };
  const expected = {
    invitees: [],
    what: [],
    where: [],
    when: [],
    name: '',
    description: '',
    host_user_id: '',
    is_poll: '',
    note: '',
    event_id: ''
  };
  
  const result = normaliseEventKeys(event);
  t.deepEqual(result, expected, 'underscores removed from object keys');
});
