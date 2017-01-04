import test from 'blue-tape';
import request from 'supertest';
import server from '../../server';
import { newEvent, existingUser } from '../utils/fixtures';

test('endpoint POST events works', (t) => {
  t.plan(2);

  request(server)
    .post('/events')
    .send(newEvent)
    .end((err, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200, 'status code is 200');
    });
});

test('endpoint POST events handles errors', (t) => {
  t.plan(1);

  request(server)
    .post('/events')
    .set('Accept', 'application/json')
    .send({})
    .then((res) => {
      t.ok(res.error instanceof Error);
    });
});

test('endpoint GET events works', (t) => {
  t.plan(2);

  request(server)
    .get('/events/1')
    .end((err, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200, 'status code is 200');
    });
});

test('endpoint DELETE events works', (t) => {
  t.plan(2);

  request(server)
    .delete('/events/2')
    .end((err, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200, 'status code is 200');
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
