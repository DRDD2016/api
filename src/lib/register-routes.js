import passport from 'passport';
import {
  postEventHandler, deleteEventHandler, getEventHandler,
  postVoteHandler, finaliseEventHandler, getInviteesHandler,
  postRsvpsHandler, patchRsvpsHandler, putEventHandler
} from './handlers';
import { signup, login } from './auth';
import passportConfig from './auth/passport-config'; // eslint-disable-line

const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

export default function registerRoutes (app) {
  app.post('/events', requireAuth, postEventHandler);
  app.delete('/events/:event_id', requireAuth, deleteEventHandler);
  app.post('/signup', signup);
  app.post('/login', requireLogin, login);
  app.post('/events/rsvps', requireAuth, postRsvpsHandler);
  app.patch('/events/:event_id/rsvps', requireAuth, patchRsvpsHandler);
  app.post('/votes/:event_id', requireAuth, postVoteHandler);
  app.patch('/events/:event_id', requireAuth, finaliseEventHandler);
  app.get('/events/:event_id/invitees', requireAuth, getInviteesHandler);
  app.put('/events/:event_id', requireAuth, putEventHandler);
  app.get('/events/:event_id', requireAuth, getEventHandler);
}
