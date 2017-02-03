import passport from 'passport';
import {
  postEventHandler, deleteEventHandler, addInviteeHandler,
  postVoteHandler, patchEventHandler, getInviteesHandler
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
  app.patch('/events/invitees', requireAuth, addInviteeHandler);
  app.post('/votes/:event_id', requireAuth, postVoteHandler);
  app.patch('/events/:event_id', requireAuth, patchEventHandler);
  app.get('/events/:event_id/invitees', requireAuth, getInviteesHandler);
}
