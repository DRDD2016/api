import test from 'blue-tape';
import request from 'supertest';
import server from '../../server';
import { newEvent } from '../utils/fixtures';

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
