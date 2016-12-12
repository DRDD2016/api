import test from 'tape';
import request from 'supertest';
import server from '../../server';
import { newEvent } from '../utils/fixtures';

test('server works', (t) => {
  t.plan(2);

  request(server)
    .post('/events')
    .send(newEvent)
    .end((err, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200, 'status code is 200');
    });
});
