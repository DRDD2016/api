import passport from 'passport';
import {
  postEventHandler, prepareToDeleteEvent, deleteEventHandler, getEventHandler,
  postVoteHandler, finaliseEventHandler, getInviteesHandler,
  postRsvpsHandler, patchRsvpsHandler, editEventHandler,
  getUserHandler, patchUserHandler, postUserPhotoHandler, addRsvps
} from './handlers';
import updateFeeds from './update-feeds';
import { signup, login } from './auth';
import passportConfig from './auth/passport-config'; // eslint-disable-line

const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

export default function registerRoutes (app) {
  app.post('/events', requireAuth, postEventHandler, updateFeeds);
  app.delete('/events/:event_id', requireAuth, prepareToDeleteEvent, updateFeeds, deleteEventHandler);
  app.post('/signup', signup);
  app.post('/login', requireLogin, login);
  app.post('/events/rsvps', requireAuth, postRsvpsHandler, addRsvps); // someone has entered code
  app.patch('/events/:event_id/rsvps', requireAuth, patchRsvpsHandler, updateFeeds); // someone has changed rsvp
  app.post('/votes/:event_id', requireAuth, postVoteHandler, updateFeeds);
  app.get('/events/:event_id/invitees', requireAuth, getInviteesHandler);
  app.put('/events/:event_id', requireAuth, editEventHandler, updateFeeds);
  app.patch('/events/:event_id', requireAuth, finaliseEventHandler, updateFeeds);
  app.get('/events/:event_id', requireAuth, getEventHandler, addRsvps);
  app.get('/users/:user_id', requireAuth, getUserHandler);
  app.patch('/users/:user_id', requireAuth, patchUserHandler);
  app.post('/upload', requireAuth, postUserPhotoHandler);
}
