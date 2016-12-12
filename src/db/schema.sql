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
  _invitees TEXT[],
  _what TEXT[],
  _where TEXT[],
  _when TEXT[]
);

INSERT INTO users (firstname, surname, password, email, photo_url, phone_number)
  VALUES (
    'Anita',
    'Jones',
    'spark',
    'anita@spark.com',
    'http://placehold.it/100x100',
    '+447777777777'
  );
