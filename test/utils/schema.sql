DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS events CASCADE;

DROP SEQUENCE IF EXISTS user_id_seq;
DROP SEQUENCE IF EXISTS event_id_seq;

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  firstname TEXT NOT NULL,
  surname TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  photo_url TEXT,
  phone_number TEXT UNIQUE
);

CREATE TABLE events (
  event_id SERIAL PRIMARY KEY,
  host_user_id INTEGER NOT NULL REFERENCES users(user_id),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  note TEXT,
  is_poll BOOLEAN DEFAULT FALSE NOT NULL,
  is_edited BOOLEAN DEFAULT FALSE NOT NULL,
  _what TEXT[],
  _where TEXT[],
  _when TEXT[],
  _invitees TEXT[]
);

/**** insert users ****/

INSERT INTO users (firstname, surname, password, email, photo_url, phone_number)
  VALUES (
    'Anita',
    'Jones',
    'spark',
    'anita@spark.com',
    'http://placehold.it/100x100',
    '+447777777777'
  );

INSERT INTO users (firstname, surname, password, email, photo_url, phone_number)
  VALUES (
    'Dave',
    'Jones',
    'spark',
    'dave@spark.com',
    'http://placehold.it/100x100',
    '+447888888888'
  );

/**** insert events ****/

INSERT INTO events (host_user_id, name, description, note, is_poll, _what, _where, _when, _invitees)
  VALUES (
    1,
    'Lounge party',
    'Celebrating life',
    '',
    true,
    '{"Dancing", "Skydiving"}',
    '{"Forest", "Camping"}',
    '{"2017-01-03T00:00:00.000Z", "2017-02-14T00:00:00.000Z"}',
    '{2}'
  );

INSERT INTO events (host_user_id, name, description, note, is_poll, _what, _where, _when, _invitees)
  VALUES (
    1,
    'Beach party',
    'Celebrating summer',
    '',
    true,
    '{"Swimming", "Sunbathing"}',
    '{"Mallorca", "Barbados"}',
    '{"2017-01-03T00:00:00.000Z", "2017-02-14T00:00:00.000Z"}',
    '{2}'
  );

INSERT INTO events (host_user_id, name, description, note, is_poll, _what, _where, _when, _invitees)
  VALUES (
    1,
    'Dinner party',
    'Celebrating nightlife',
    '',
    true,
    '{"Eating", "Tasting"}',
    '{"New York", "Los Angeles"}',
    '{"2017-01-03T00:00:00.000Z", "2017-02-14T00:00:00.000Z"}',
    '{2}'
  );
