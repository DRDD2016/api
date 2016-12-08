import test from 'tape';
import request from 'supertest';
import server from '../server';

test('server works', (t) => {
  t.plan(1);
  request(server)
    .get('/')
    .end((err, res) => {
      t.equal(res.statusCode, 200, 'status code is 200');
    });
});
