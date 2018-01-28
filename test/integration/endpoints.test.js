import test from 'blue-tape';
import client from '../../src/db/client';
import request from 'supertest';
import FormData from 'form-data';
import path from 'path';
import server from '../../server';
import {
  newEvent, existingUser as user,
  event_1, event_2, event_3, event_4,
   vote, hostEventChoices,
   rsvps_3, rsvps_4, emptyRsvps,
   updatedRsvp, updatedRsvp_2,
   editedEvent as event,
   userData
 } from '../utils/fixtures';
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
      t.equal(res.statusCode, 201, 'status code is 201');
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

test('endpoint GET events/:event_id works', (t) => {
  t.plan(9);
  initDb()
  .then(() => {

    const eventWithNoRsvps = 2;
    request(server)
    .get(`/events/${eventWithNoRsvps}`)
    .set('authorization', token)
    .end((err, res) => {
      const expected = { ...event_2, rsvps: emptyRsvps };
      t.deepEqual(res.body, expected);
      t.notOk(err);
      t.equal(res.statusCode, 200, 'status code is 200');
    });

    const eventWithRsvps = 3;
    request(server)
    .get(`/events/${eventWithRsvps}`)
    .set('authorization', token)
    .end((err, res) => {
      const expected = { ...event_3, rsvps: rsvps_3 };
      t.notOk(err);
      t.deepEqual(res.body, expected);
      t.equal(res.statusCode, 200, 'status code is 200');
    });

    const eventWithNoResponses = 4;
    request(server)
    .get(`/events/${eventWithNoResponses}`)
    .set('authorization', token)
    .end((err, res) => {
      const expected = { ...event_4, rsvps: rsvps_4 };
      t.notOk(err);
      t.deepEqual(res.body, expected);
      t.equal(res.statusCode, 200, 'status code is 200');
    });
  });
});

test('endpoint GET events/:event_id handles unauthorised requests', (t) => {
  t.plan(1);
  initDb()
  .then(() => {

    const event_id = 1;
    request(server)
    .get(`/events/${event_id}`)
    .end((err, res) => {
      t.equal(res.statusCode, 401, 'missing token returns Unauthorized status code');
    });
  });
});

test('endpoint GET events handles unknown event id', (t) => {
  t.plan(2);
  initDb()
  .then(() => {

    const event_id = 111;
    request(server)
    .get(`/events/${event_id}`)
    .set('authorization', token)
    .end((err, res) => {
      t.equal(res.statusCode, 422, 'Unknown event id returns 422 status code');
      t.deepEqual(res.body,  { error: 'Event has been deleted' });
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
      t.equal(res.statusCode, 204, 'status code is 204 (No Content)');
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
    .send(user)
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
  t.plan(11);
  initDb()
  .then(() => {

    request(server)
    .post('/login')
    .set('Accept', 'application/json')
    .send({ email: user.email, password: user.password })
    .then((res) => {

      const expectedKeys = ['token', 'firstname', 'surname', 'email', 'user_id', 'photo_url', 'push_info', 'reset_password_token', 'reset_password_expires'];
      Object.keys(res.body).forEach((key) => {
        t.ok(expectedKeys.includes(key), `${key} exists`);

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
      t.equal(res.statusCode, 201, 'status code is 201');
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

test('endpoint PATCH events/:event_id/rsvps works', (t) => {
  t.plan(4);
  initDb()
  .then(() => {
    const event_id = 4;

    request(server)
    .patch(`/events/${event_id}/rsvps`)
    .set('Accept', 'application/json')
    .set('authorization', createToken(3))
    .send({ status: 'going' })
    .then((res) => {
      t.equal(res.statusCode, 201, 'status code is 201');
      t.deepEqual(res.body.rsvps, updatedRsvp);
    });
    setTimeout(() => {

      request(server)
      .patch(`/events/${event_id}/rsvps`)
      .set('Accept', 'application/json')
      .set('authorization', createToken(3))
      .send({ status: 'not_going' })
      .then((res) => {
        t.equal(res.statusCode, 201, 'status code is 201');
        t.deepEqual(res.body.rsvps, updatedRsvp_2);
      });
    }, 500);
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

test.skip('endpoint GET events/:event_id/invitees works', (t) => {
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
      t.deepEqual(res.body, rsvps_3, 'correct invitees received');
    })
    .catch(err => console.error(err));
  });
});

test.skip('endpoint GET events/:event_id/invitees handles internal errors', (t) => {
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

test('endpoint PUT events/:event_id works', (t) => {
  t.plan(1);
  initDb()
  .then(() => {

    const event_id = 3;

    request(server)
    .put(`/events/${event_id}`)
    .set('Accept', 'application/json')
    .set('authorization', createToken(3))
    .send({ event })
    .then((res) => {
      t.equal(res.statusCode, 201, 'status code is 201');
    })
    .catch(err => console.error(err));
  });
});

test('endpoint PUT events/:event_id handles missing data', (t) => {
  t.plan(1);
  // this test clashes with the previous one sometimes.  This helps avoid it.
  setTimeout(() => {
    initDb()
    .then(() => {

        const event_id = 3;

        request(server)
        .put(`/events/${event_id}`)
        .set('Accept', 'application/json')
        .set('authorization', createToken(3))
        .then((res) => {
          t.equal(res.statusCode, 422, 'status code is 422');
        })
        .catch(err => console.error(err));
      });
  }, 500);
});

test('endpoint PUT events/:event_id handles unknown event id', (t) => {
  t.plan(2);
  initDb()
  .then(() => {

    const event_id = 33;

    request(server)
    .put(`/events/${event_id}`)
    .set('Accept', 'application/json')
    .set('authorization', createToken(3))
    .send({ event })
    .then((res) => {
      t.equal(res.statusCode, 422, 'status code is 422');
      t.deepEqual(res.body, { error: 'Could not edit event' });
    })
    .catch(err => console.error(err));
  });
});

test('endpoint GET users/:user_id works', (t) => {
  t.plan(2);
  initDb()
  .then(() => {

    const user_id = 1;
    request(server)
    .get(`/users/${user_id}`)
    .set('authorization', token)
    .end((err, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200, 'status code is 200');
    });
  });
});

test('endpoint GET users/:user_id handles unauthorised requests', (t) => {
  t.plan(1);
  initDb()
  .then(() => {

    const user_id = 1;
    request(server)
    .get(`/users/${user_id}`)
    .end((err, res) => {
      t.equal(res.statusCode, 401, 'missing token returns Unauthorized status code');
    });
  });
});

test('endpoint GET users/:user_id handles unknown user id', (t) => {
  t.plan(2);
  initDb()
  .then(() => {

    const user_id = 111;
    request(server)
    .get(`/users/${user_id}`)
    .set('authorization', token)
    .end((err, res) => {
      t.equal(res.statusCode, 422, 'Unknown user id returns 422 status code');
      t.deepEqual(res.body,  { error: 'Could not get user' });
    });
  });
});

test('endpoint PATCH users/:users_id works', (t) => {
  t.plan(3);
  initDb()
  .then(() => {

    const user_id = 1;

    request(server)
    .patch(`/users/${user_id}`)
    .set('Accept', 'application/json')
    .set('authorization', createToken(user_id))
    .send({ user: userData })
    .then((res) => {
      t.equal(res.statusCode, 200, 'status code is 200');
      t.equal(res.body.firstname, userData.firstname, 'succesfully updates user firstname');
      t.equal(res.body.surname, userData.surname, 'succesfully updates user firstname');
    })
    .catch(err => console.error(err));
  });
});

test('endpoint PATCH users/:user_id handles internal errors', (t) => {
  t.plan(2);
  initDb()
  .then(() => {

    const user_id = 100;

    request(server)
    .patch(`/users/${user_id}`)
    .set('Accept', 'application/json')
    .set('authorization', createToken(1))
    .send({ user: userData })
    .then((res) => {
      t.equal(res.statusCode, 422, 'status code is 422');
      t.deepEqual(res.body, { error: 'Could not update user' });
    })
    .catch(err => console.error(err));
  });
});

test.skip('endpoint POST /upload works', (t) => {
  t.plan(1);
  initDb()
  .then(() => {
    const form = new FormData();
    form.append('photo', {
      uri: path.resolve('../utils/test-img.png'),
      ext: 'png',
      type: 'image/png'
    });
    request(server)
    .post('/upload')
    .set('Accept', 'application/json')
    .set('Content-Type', 'multipart/form-data')
    .set('authorization', createToken(1))
    .send(form)
    .then((res) => {
      t.equal(res.statusCode, 201, 'status code is 201');
      // t.deepEqual(res.body, { error: 'Could not update user' });
    })
    .catch(err => console.error(err));
  });
});


test('endpoint PATCH users/:users_id/feed works', (t) => {
  t.plan(1);
  initDb()
  .then(() => {

    const user_id = 1;
    const feed_item_id = 2;
    request(server)
    .patch(`/users/${user_id}/feed`)
    .set('Accept', 'application/json')
    .set('authorization', createToken(user_id))
    .send({ id: feed_item_id })
    .then((res) => {
      t.equal(res.statusCode, 204, 'status code is 204');
    })
    .catch(err => console.error(err));
  });
});

test('endpoint PATCH users/:user_id/feed handles internal errors', (t) => {
  t.plan(2);
  initDb()
  .then(() => {

    const user_id = 100;
    request(server)
    .patch(`/users/${user_id}/feed`)
    .set('Accept', 'application/json')
    .set('authorization', createToken(1))
    .then((res) => {
      t.equal(res.statusCode, 422, 'status code is 422');
      t.deepEqual(res.body, { error: 'Missing feed item id' });
    })
    .catch(err => console.error(err));
  });
});

test('endpoint GET votes/:event_id works for host', (t) => {
  t.plan(1);
  initDb()
  .then(() => {

    const event_id = 1;
    request(server)
    .get(`/votes/${event_id}?all=true`)
    .set('authorization', token)
    .end((err, res) => {
      t.equal(res.statusCode, 200, 'status code is 200');
    });
  });
});

test('endpoint GET votes/:event_id works for invitee', (t) => {
  t.plan(1);
  initDb()
  .then(() => {

    const event_id = 1;
    request(server)
    .get(`/votes/${event_id}?all=false`)
    .set('authorization', token)
    .end((err, res) => {
      t.equal(res.statusCode, 200, 'status code is 200');
    });
  });
});


test('endpoint GET votes/:event_id handles unknown event id', (t) => {
  t.plan(2);
  initDb()
  .then(() => {

    const event_id = 111;
    request(server)
    .get(`/votes/${event_id}?all=false`)
    .set('authorization', token)
    .then((res) => {
      t.equal(res.statusCode, 422, 'Unknown event id returns 422 status code');
      t.deepEqual(res.body,  { error: 'Unknown event; no votes found' });
    });
  });
});

test('endpoint GET users/:user_id/calendar works', (t) => {
  t.plan(1);
  initDb()
  .then(() => {

    const user_id = 3;
    request(server)
    .get(`/calendar`)
    .set('authorization', createToken(user_id))
    .end((err, res) => {
      t.equal(res.statusCode, 200, 'status code is 200');
    });
  });
});

test('endpoint GET /calendar handles unauthorised requests', (t) => {
  t.plan(1);
  initDb()
  .then(() => {

    const user_id = 111;
    request(server)
    .get(`/calendar`)
    .set('authorization', createToken(user_id))
    .then((res) => {
      t.equal(res.statusCode, 401, 'Unauthorized status code');
    });
  });
});
