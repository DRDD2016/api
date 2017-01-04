import passport from 'passport';
import { postEventHandler, getEventHandler, deleteEventHandler } from './handlers';
import { signup, login } from './auth';
import passportConfig from './auth/passport-config'; // eslint-disable-line

const requireLogin = passport.authenticate('local', { session: false });

export default function registerRoutes (app) {
  app.post('/events', postEventHandler);
  app.get('/events/:event_id', getEventHandler);
  app.delete('/events/:event_id', deleteEventHandler);
  app.post('/signup', signup);
  app.post('/login', requireLogin, login);
}
