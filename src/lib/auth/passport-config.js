import passport from 'passport';
import bcrypt from 'bcrypt';
import LocalStrategy from 'passport-local';
// const { Strategy, ExtractJwt } = require('passport-jwt');
import client from '../../db/client';
import findUserByEmail from './find-user-by-email';

//LOGIN - local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, localLoginStrategy);
passport.use(localLogin);

function localLoginStrategy (email, password, done) {
  findUserByEmail(client, email)
    .then((user) => {
      if (!user) {
        return done(null, false);
      }
      return user;
    })
    .then((user) => {
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (!isMatch) {
          return done(null, false);
        }
        delete user.password;
        return done(null, user);
      });
    })
    .catch(err => done(err));
}
