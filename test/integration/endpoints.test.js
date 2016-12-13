import test from 'blue-tape';
import request from 'supertest';
import server from '../../server';
import { newEvent } from '../utils/fixtures';

test('POST events works', (t) => {
  t.plan(2);

  request(server)
    .post('/events')
    .send(newEvent)
    .end((err, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200, 'status code is 200');
    });
});

test('POST events handles errors', (t) => {
  return t.shouldFail(request(server)
    .post('/events')
    .send({})
    .end()
  );
});

test('GET events works', (t) => {
  t.plan(2);

  request(server)
    .get('/events/1')
    .set('Accept', 'application/json')
    .end((err, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200, 'status code is 200');
    });
});
