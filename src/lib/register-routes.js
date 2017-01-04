import passport from 'passport';
import { postEventHandler, getEventHandler, deleteEventHandler } from './handlers';
import { signup, login } from './auth';
import passportConfig from './auth/passport-config'; // eslint-disable-line

const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

export default function registerRoutes (app) {
  app.post('/events', requireAuth, postEventHandler);
  app.get('/events/:event_id', requireAuth, getEventHandler);
  app.delete('/events/:event_id', requireAuth, deleteEventHandler);
  app.post('/signup', signup);
  app.post('/login', requireLogin, login);
}
