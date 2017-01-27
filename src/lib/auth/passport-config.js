import passport from 'passport';
import bcrypt from 'bcrypt';
import LocalStrategy from 'passport-local';
import { Strategy, ExtractJwt } from 'passport-jwt';
import client from '../../db/client';
import getUserByEmail from './get-user-by-email';
import getUserById from './get-user-by-id';

//LOGIN - local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, localLoginStrategy);
passport.use(localLogin);

//JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.SECRET_JWT
};
const jwtAuth = new Strategy(jwtOptions, jwtStrategy);
passport.use(jwtAuth);

function localLoginStrategy (email, password, done) {
  getUserByEmail(client, email)
    .then((user) => {
      if (!user) {
        return done(null, false);
      }
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

function jwtStrategy (payload, done) {
  getUserById(client, payload.sub)
    .then((user) => {
      if (!user) return done(null, false);
      return done(null, user);
    })
    .catch(err => done(err));
}
