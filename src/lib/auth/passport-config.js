const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { secret } = require('./config');
// tell passport where to find the JWT in the request
const options = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: secret
};

// create JWT strategy
const jwtLogin = new Strategy(options, loginStrategy);

// tell passport to use this strategy
passport.use(jwtLogin);

function loginStrategy (payload, done) {
  // check if user_id exists in db
  findUser(payload.sub, (err, result) => {
    if (err) throw err;
    if (result) {
      return done(null, result);
    }
    done(null, false);
  });
}
