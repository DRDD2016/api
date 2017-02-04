import test from 'blue-tape';
import client from '../../src/db/client';
import request from 'supertest';
import server from '../../server';
import { newEvent, existingUser as user, event_1, vote, hostEventChoices, rsvps } from '../utils/fixtures';
import { createToken } from '../../src/lib/auth';

const initDb = require('../utils/init-db')(client);

const token = createToken(user.user_id);

test('endpoint POST events works', (t) => {
  t.plan(2);
  initDb()
  .then(() => {

    request(server)
    .post('/events')
    .set('authorization', token)
    .send({ event: newEvent })
    .end((err, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200, 'status code is 200');
    });
  });
});

test('endpoint POST events handles errors', (t) => {
  t.plan(3);
  initDb()
  .then(() => {

    request(server)
    .post('/events')
    .set('authorization', token)
    .set('Accept', 'application/json')
    .then((res) => {
      t.equal(res.statusCode, 422, 'missing event data returns 422 status code');
      t.deepEqual(res.body, { error: 'Missing event data' });
    });

    request(server)
    .post('/events')
    .set('Accept', 'application/json')
    .then((res) => {
      t.equal(res.statusCode, 401, 'missing token returns Unauthorized status code');
    });
  });
});

test.skip('endpoint GET events works', (t) => {
  t.plan(2);
  initDb()
  .then(() => {

    request(server)
    .get('/events/1')
    .set('authorization', token)
    .end((err, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200, 'status code is 200');
    });
  });
});

test.skip('endpoint GET events handles errors', (t) => {
  t.plan(1);
  initDb()
  .then(() => {

    request(server)
    .get('/events/1')
    .end((err, res) => {
      t.equal(res.statusCode, 401, 'missing token returns Unauthorized status code');
    });
  });
});

test('endpoint DELETE events/:event_id works', (t) => {
  t.plan(2);
  initDb()
  .then(() => {

    request(server)
    .delete('/events/3')
    .set('authorization', token)
    .end((err, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200, 'status code is 200');
    });
  });
});

test('endpoint DELETE events/:event_id handles errors', (t) => {
  t.plan(1);
  initDb()
  .then(() => {

    request(server)
    .delete('/events/2')
    .end((err, res) => {
      t.equal(res.statusCode, 401, 'missing token returns Unauthorized status code');
    });
  });
});

test('endpoint POST signup works', (t) => {
  t.plan(2);
  initDb()
  .then(() => {

    const user = { firstname: 'Bob', surname: 'Dylan', email: 'bob@spark.com', password: 'password' };
    request(server)
    .post('/signup')
    .set('Accept', 'application/json')
    .send({ user })
    .then((res) => {
      t.ok(res.body.hasOwnProperty('token'), 'Token exists in the response body');
      t.equal(res.statusCode, 201, 'status code is 201');
    });
  });
});

test('endpoint POST signup rejects existing user', (t) => {
  t.plan(1);
  initDb()
  .then(() => {

    request(server)
    .post('/signup')
    .set('Accept', 'application/json')
    .send({ user })
    .then((res) => {
      t.equal(res.statusCode, 422, 'status code is 422');
    });
  });
});

test('endpoint POST signup rejects missing data', (t) => {
  t.plan(1);
  initDb()
  .then(() => {

    const user = { firstname: '', surname: 'Dove' };
    request(server)
    .post('/signup')
    .set('Accept', 'application/json')
    .send({ user })
    .then((res) => {
      t.equal(res.statusCode, 422, 'status code is 422');
    });
  });
});

test('endpoint POST login works', (t) => {
  t.plan(6);
  initDb()
  .then(() => {

    request(server)
    .post('/login')
    .set('Accept', 'application/json')
    .send({ email: user.email, password: user.password })
    .then((res) => {

      ['token', 'firstname', 'surname', 'email'].forEach((key) => {
        t.ok(res.body.hasOwnProperty(key), `${key} exists in the response body`);
      });
      t.ok(!res.body.hasOwnProperty('password'), '`password` not in response body');
      t.equal(res.statusCode, 201, 'status code is 201');
    });
  });
});

test('endpoint POST events/rsvps works', (t) => {
  t.plan(1);
  initDb()
  .then(() => {

    request(server)
    .post('/events/rsvps')
    .set('Accept', 'application/json')
    .set('authorization', createToken(3))
    .send({ code: event_1.code })
    .then((res) => {
      t.equal(res.statusCode, 201, 'status code is 201');
      // t.deepEqual(JSON.parse(res.body), Object.assign({}, event_1, { _invitees: ['2', '3'] }), 'returns event data');
    });
  });
});

test('endpoint POST events/rsvps handles missing code', (t) => {
  t.plan(2);
  initDb()
  .then(() => {

    request(server)
    .post('/events/rsvps')
    .set('Accept', 'application/json')
    .set('authorization', createToken(3))
    .then((res) => {
      t.equal(res.statusCode, 422, 'status code is 422');
      t.deepEqual(res.body, { error: 'No code submitted' });
      // t.deepEqual(JSON.parse(res.body), Object.assign({}, event_1, { _invitees: ['2', '3'] }), 'returns event data');
    })
    .catch(err => console.error(err));
  });
});

test('endpoint POST votes/:event_id works', (t) => {
  t.plan(1);
  initDb()
  .then(() => {

    const event_id = 1;
    request(server)
    .post(`/votes/${event_id}`)
    .set('Accept', 'application/json')
    .set('authorization', createToken(3))
    .send({ vote })
    .then((res) => {
      t.equal(res.statusCode, 201, 'status code is 201');
    })
    .catch(err => console.error(err));
  });
});

test('endpoint POST votes/:event_id rejects unauthorised requests', (t) => {
  t.plan(1);
  initDb()
  .then(() => {

    const event_id = 1;
    request(server)
    .post(`/votes/${event_id}`)
    .set('Accept', 'application/json')
    .send({ vote })
    .then((res) => {
      t.equal(res.statusCode, 401, 'status code is 401');
    })
    .catch(err => console.error(err));
  });
});

test('endpoint PATCH events/:event_id works', (t) => {
  t.plan(2);
  initDb()
  .then(() => {

    const event_id = 1;

    request(server)
    .patch(`/events/${event_id}`)
    .set('Accept', 'application/json')
    .set('authorization', createToken(3))
    .send({ hostEventChoices })
    .then((res) => {
      t.equal(res.statusCode, 200, 'status code is 200');
      t.deepEqual(res.body, hostEventChoices);
    })
    .catch(err => console.error(err));
  });
});

test('endpoint PATCH events/:event_id handles internal errors', (t) => {
  t.plan(2);
  initDb()
  .then(() => {

    const event_id = 100;

    request(server)
    .patch(`/events/${event_id}`)
    .set('Accept', 'application/json')
    .set('authorization', createToken(3))
    .send({ hostEventChoices })
    .then((res) => {
      t.equal(res.statusCode, 422, 'status code is 422');
      t.deepEqual(res.body, { error: 'Could not finalise event' });
    })
    .catch(err => console.error(err));
  });
});

test.skip('endpoint PATCH events/:event_id/rsvps works', (t) => {
  t.plan(1);
  initDb()
  .then(() => {
    // event_id
    // rsvp data

    request(server)
    .patch('/events/:event_id/rsvps')
    .set('Accept', 'application/json')
    .set('authorization', createToken(3))
    .send({ rsvps })
    .then((res) => {
      t.equal(res.statusCode, 201, 'status code is 201');
      // t.deepEqual(JSON.parse(res.body), Object.assign({}, event_1, { _invitees: ['2', '3'] }), 'returns event data');
    });
  });
});

test('endpoint PATCH events/:event_id/rsvps handles missing data', (t) => {
  t.plan(2);
  initDb()
  .then(() => {

    request(server)
    .patch('/events/:event_id/rsvps')
    .set('Accept', 'application/json')
    .set('authorization', createToken(3))
    .then((res) => {
      t.equal(res.statusCode, 422, 'status code is 422');
      t.deepEqual(res.body, { error: 'Missing rsvp data' });
      // t.deepEqual(JSON.parse(res.body), Object.assign({}, event_1, { _invitees: ['2', '3'] }), 'returns event data');
    })
    .catch(err => console.error(err));
  });
});

test('endpoint GET events/:event_id/invitees works', (t) => {
  t.plan(2);
  initDb()
  .then(() => {

    const event_id = 3;

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
});

test('endpoint GET events/:event_id/invitees handles internal errors', (t) => {
  t.plan(2);
  initDb()
  .then(() => {

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
});
