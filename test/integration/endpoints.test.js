import test from 'blue-tape';
import request from 'supertest';
import server from '../../server';
import { newEvent, existingUser, event_1 } from '../utils/fixtures';
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

test('endpoint DELETE events works', (t) => {
  t.plan(2);

  request(server)
    .delete('/events/2')
    .set('authorization', token)
    .end((err, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200, 'status code is 200');
    });
});

test('endpoint DELETE events handles errors', (t) => {
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

test('endpoint PATCH event/invitees works', (t) => {

  request(server)
    .post('/event/invitees')
    .set('Accept', 'application/json')
    .set('authorization', token)
    .send({ code: event_1.code })
    .then((res) => {
      t.equal(res.statusCode, 201, 'status code is 201');
      t.deepEqual(res.body, event_1, 'returns event data');
    });
});
