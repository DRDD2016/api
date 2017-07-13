import passport from 'passport';
import {
  postEventHandler, deleteEventHandler, getEventHandler,
  postVoteHandler, finaliseEventHandler, getInviteesHandler,
  postRsvpsHandler, patchRsvpsHandler, editEventHandler,
  getUserHandler, patchUserHandler, postUserPhotoHandler, addRsvps,
  sendResetPasswordEmail, renderResetPasswordPageHandler, resetPassword,
  editFeedHandler, getVotesHandler, getCalendarHandler, patchPushHandler
} from './handlers';
import updateFeeds from './update-feeds';
import { signup, login } from './auth';
import passportConfig from './auth/passport-config'; // eslint-disable-line

const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

export default function registerRoutes (app) {
  app.post('/events', requireAuth, postEventHandler, updateFeeds);
  app.delete('/events/:event_id', requireAuth, deleteEventHandler);
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
  app.post('/reset-password', sendResetPasswordEmail);
  app.get('/reset/:token', renderResetPasswordPageHandler);
  app.post('/reset', resetPassword);
  app.patch('/users/:user_id/feed', requireAuth, editFeedHandler);
  app.get('/votes/:event_id', requireAuth, getVotesHandler);
  app.get('/calendar', requireAuth, getCalendarHandler);
  app.patch('/savePush/:user_id', requireAuth, patchPushHandler);
}
