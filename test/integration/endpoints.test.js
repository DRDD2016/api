import test from 'blue-tape';
import request from 'supertest';
import server from '../../server';
import { newEvent, existingUser, event_1, vote, hostEventChoices, rsvps } from '../utils/fixtures';
import { createToken } from '../../src/lib/auth';

const token = createToken(existingUser.user_id);

test('endpoint POST events works', (t) => {
  t.plan(2);

  request(server)
    .post('/events')
    .set('authorization', token)
    .send(newEvent)
    .end((err, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200, 'status code is 200');
    });
});

test('endpoint POST events handles errors', (t) => {
  t.plan(2);

  request(server)
    .post('/events')
    .set('authorization', token)
    .set('Accept', 'application/json')
    .send({})
    .then((res) => {
      t.ok(res.error instanceof Error);
    });

  request(server)
    .post('/events')
    .set('Accept', 'application/json')
    .send({})
    .then((res) => {
      t.equal(res.statusCode, 401, 'missing token returns Unauthorized status code');
    });
});

test.skip('endpoint GET events works', (t) => {
  t.plan(2);

  request(server)
    .get('/events/1')
    .set('authorization', token)
    .end((err, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200, 'status code is 200');
    });
});

test.skip('endpoint GET events handles errors', (t) => {
  t.plan(1);

  request(server)
    .get('/events/1')
    .end((err, res) => {
      t.equal(res.statusCode, 401, 'missing token returns Unauthorized status code');
    });
});

test('endpoint DELETE events/:event_id works', (t) => {
  t.plan(2);

  request(server)
    .delete('/events/3')
    .set('authorization', token)
    .end((err, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200, 'status code is 200');
    });
});

test('endpoint DELETE events/:event_id handles errors', (t) => {
  t.plan(1);

  request(server)
    .delete('/events/2')
    .end((err, res) => {
      t.equal(res.statusCode, 401, 'missing token returns Unauthorized status code');
    });
});

test('endpoint POST signup works', (t) => {
  t.plan(2);
  const user = { firstname: 'Bob', surname: 'Dylan', email: 'bob@spark.com', password: 'password' };
  request(server)
    .post('/signup')
    .set('Accept', 'application/json')
    .send(user)
    .then((res) => {
      t.ok(res.body.hasOwnProperty('token'), 'Token exists in the response body');
      t.equal(res.statusCode, 201, 'status code is 201');
    });
});

test('endpoint POST signup rejects existing user', (t) => {
  t.plan(1);

  request(server)
    .post('/signup')
    .set('Accept', 'application/json')
    .send(existingUser)
    .then((res) => {
      t.equal(res.statusCode, 422, 'status code is 422');
    });
});

test('endpoint POST signup rejects missing data', (t) => {
  t.plan(1);
  const user = { firstname: '', surname: 'Dove' };
  request(server)
    .post('/signup')
    .set('Accept', 'application/json')
    .send(user)
    .then((res) => {
      t.equal(res.statusCode, 422, 'status code is 422');
    });
});

test('endpoint POST login works', (t) => {
  t.plan(6);

  request(server)
    .post('/login')
    .set('Accept', 'application/json')
    .send(existingUser)
    .then((res) => {

      ['token', 'firstname', 'surname', 'email'].forEach((key) => {
        t.ok(res.body.hasOwnProperty(key), `${key} exists in the response body`);
      });
      t.ok(!res.body.hasOwnProperty('password'), '`password` not in response body');
      t.equal(res.statusCode, 201, 'status code is 201');
    });
});

test('endpoint PATCH events/invitees works', (t) => {
  t.plan(1);
  request(server)
    .patch('/events/invitees')
    .set('Accept', 'application/json')
    .set('authorization', createToken(3))
    .send({ code: event_1.code })
    .then((res) => {
      t.equal(res.statusCode, 201, 'status code is 201');
      // t.deepEqual(JSON.parse(res.body), Object.assign({}, event_1, { _invitees: ['2', '3'] }), 'returns event data');
    });
});

test('endpoint PATCH events/invitees handles missing code', (t) => {
  t.plan(2);
  request(server)
    .patch('/events/invitees')
    .set('Accept', 'application/json')
    .set('authorization', createToken(3))
    .then((res) => {
      t.equal(res.statusCode, 422, 'status code is 422');
      t.deepEqual(res.body, { error: 'No code submitted' });
      // t.deepEqual(JSON.parse(res.body), Object.assign({}, event_1, { _invitees: ['2', '3'] }), 'returns event data');
    })
    .catch(err => console.error(err));
});

test('endpoint POST votes/:event_id works', (t) => {
  t.plan(1);
  const event_id = 1;
  request(server)
    .post(`/votes/${event_id}`)
    .set('Accept', 'application/json')
    .set('authorization', createToken(3))
    .send(vote)
    .then((res) => {
      t.equal(res.statusCode, 201, 'status code is 201');
    })
    .catch(err => console.error(err));
});

test('endpoint POST votes/:event_id rejects unauthorised requests', (t) => {
  t.plan(1);
  const event_id = 1;
  request(server)
    .post(`/votes/${event_id}`)
    .set('Accept', 'application/json')
    .send(vote)
    .then((res) => {
      t.equal(res.statusCode, 401, 'status code is 401');
    })
    .catch(err => console.error(err));
});

test('endpoint PATCH events/:event_id works', (t) => {
  t.plan(2);
  const event_id = 1;

  request(server)
    .patch(`/events/${event_id}`)
    .set('Accept', 'application/json')
    .set('authorization', createToken(3))
    .send(hostEventChoices)
    .then((res) => {
      t.equal(res.statusCode, 200, 'status code is 200');
      t.deepEqual(res.body, hostEventChoices);
    })
    .catch(err => console.error(err));
});

test('endpoint PATCH events/:event_id handles internal errors', (t) => {
  t.plan(2);
  const event_id = 100;

  request(server)
    .patch(`/events/${event_id}`)
    .set('Accept', 'application/json')
    .set('authorization', createToken(3))
    .send(hostEventChoices)
    .then((res) => {
      t.equal(res.statusCode, 422, 'status code is 422');
      t.deepEqual(res.body, { error: 'Could not finalise event' });
    })
    .catch(err => console.error(err));
});

test('endpoint GET events/:event_id/invitees works', (t) => {
  t.plan(2);
  const event_id = 1;

  request(server)
    .get(`/events/${event_id}/invitees`)
    .set('Accept', 'application/json')
    .set('authorization', createToken(3))
    .then((res) => {
      t.equal(res.statusCode, 200, 'status code is 200');
      t.deepEqual(res.body, rsvps, 'correct invitees received');
    })
    .catch(err => console.error(err));
});

test('endpoint GET events/:event_id/invitees handles internal errors', (t) => {
  t.plan(2);
  const event_id = 188;

  request(server)
    .get(`/events/${event_id}/invitees`)
    .set('Accept', 'application/json')
    .set('authorization', createToken(3))
    .then((res) => {
      t.equal(res.statusCode, 422, 'status code is 422');
      t.deepEqual(res.body, { error: 'Could not get invitees' });
    })
    .catch(err => console.error(err));
});
