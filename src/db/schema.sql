DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS feeds CASCADE;
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS rsvps CASCADE;

DROP SEQUENCE IF EXISTS user_id_seq;
DROP SEQUENCE IF EXISTS event_id_seq;
DROP SEQUENCE IF EXISTS feeds_id_seq;

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  firstname TEXT NOT NULL,
  surname TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  photo_url TEXT NOT NULL DEFAULT 'https://s3.eu-west-2.amazonaws.com/spark-native/avatar.png',
  push_info TEXT,
  reset_password_token TEXT,
  reset_password_expires TEXT
);

CREATE TABLE events (
  event_id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  host_user_id INTEGER NOT NULL REFERENCES users(user_id),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  note TEXT,
  is_poll BOOLEAN NOT NULL,
  _what TEXT[],
  _where TEXT[],
  _when TEXT[],
  edited BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE feeds (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id),
  event_id INTEGER,
  data jsonb NOT NULL
);

CREATE TABLE votes (
  event_id INTEGER NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  _what INTEGER[],
  _where INTEGER[],
  _when INTEGER[],
  PRIMARY KEY (user_id, event_id)
);

CREATE TABLE rsvps (
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  event_id INTEGER NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_responded',
  PRIMARY KEY (user_id, event_id)
);
