DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS rsvps CASCADE;

DROP SEQUENCE IF EXISTS user_id_seq;
DROP SEQUENCE IF EXISTS event_id_seq;

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  firstname TEXT NOT NULL,
  surname TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  photo_url TEXT
);

CREATE TABLE events (
  event_id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  host_user_id INTEGER NOT NULL REFERENCES users(user_id),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  note TEXT,
  is_poll BOOLEAN DEFAULT FALSE NOT NULL,
  _what TEXT[],
  _where TEXT[],
  _when TEXT[]
);

CREATE TABLE votes (
  event_id INTEGER NOT NULL REFERENCES events(event_id),
  user_id INTEGER NOT NULL REFERENCES users(user_id),
  _what INTEGER[],
  _where INTEGER[],
  _when INTEGER[],
  PRIMARY KEY (user_id, event_id)
);

CREATE TABLE rsvps (
  user_id INTEGER NOT NULL REFERENCES users(user_id),
  event_id INTEGER NOT NULL REFERENCES events(event_id),
  status TEXT,
  PRIMARY KEY (user_id, event_id)
);

/**** insert users ****/

INSERT INTO users (firstname, surname, password, email, photo_url)
  VALUES (
    'Anita',
    'Jones',
    '$2a$11$k2mul7EmRfNPZBsgUBll7es2jlby//mEvfYczYPj83fC7utPvKGcK',
    'anita@spark.com',
    'http://placehold.it/100x100'
  );

INSERT INTO users (firstname, surname, password, email, photo_url)
  VALUES (
    'Dave',
    'Jones',
    '$2a$11$k2mul7EmRfNPZBsgUBll7es2jlby//mEvfYczYPj83fC7utPvKGcK',
    'dave@spark.com',
    'http://placehold.it/100x100'
  );

INSERT INTO users (firstname, surname, password, email, photo_url)
  VALUES (
    'Sohil',
    'Pandya',
    '$2a$11$k2mul7EmRfNPZBsgUBll7es2jlby//mEvfYczYPj83fC7utPvKGcK',
    'sohil@spark.com',
    'http://placehold.it/100x100'
  );

INSERT INTO users (firstname, surname, password, email, photo_url)
  VALUES (
    'Mickey',
    'Mouse',
    '$2a$11$k2mul7EmRfNPZBsgUBll7es2jlby//mEvfYczYPj83fC7utPvKGcK',
    'mickey@spark.com',
    'http://placehold.it/100x100'
  );

/**** insert events ****/

INSERT INTO events (host_user_id, name, description, note, is_poll, _what, _where, _when, _invitees, code)
  VALUES (
    1,
    'Lounge party',
    'Celebrating life',
    '',
    true,
    '{"Dancing", "Skydiving"}',
    '{"Forest", "Camping"}',
    '{"2017-01-03T00:00:00.000Z", "2017-02-14T00:00:00.000Z"}',
    '{2}',
    'FAKECODE'
  );

INSERT INTO events (host_user_id, name, description, note, is_poll, _what, _where, _when, _invitees, code)
  VALUES (
    1,
    'Beach party',
    'Celebrating summer',
    '',
    true,
    '{"Swimming", "Sunbathing"}',
    '{"Mallorca", "Barbados"}',
    '{"2017-01-03T00:00:00.000Z"}',
    '{2}',
    'FAKECODE2'
  );

INSERT INTO events (host_user_id, name, description, note, is_poll, _what, _where, _when, _invitees, code)
  VALUES (
    3,
    'Beach party',
    'Celebrating summer',
    '',
    true,
    '{"Swimming"}',
    '{"Mallorca"}',
    '{"2017-01-03T00:00:00.000Z"}',
    '{2}',
    'FAKECODE2'
  );

/**** insert votes ****/

INSERT INTO votes (event_id, user_id, _what, _where, _when)
  VALUES (
    1,
    2,
    '{0, 1}',
    '{1, 0}',
    '{1, 1}'
  ),
  (
    1,
    3,
    '{1, 1}',
    '{0, 1}',
    '{1, 0}'
  );

INSERT INTO rsvps (user_id, event_id, status)
  VALUES (
    2,
    1,
    'going'
  ),
  (
    3,
    1,
    'not_going'
  ),
  (
    4,
    2,
    'maybe'
  );
