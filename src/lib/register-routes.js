import { postEventHandler, getEventHandler, deleteEventHandler } from './handlers';
import { signup } from './auth';

export default function registerRoutes (app) {
  app.post('/events', postEventHandler);
  app.get('/events/:event_id', getEventHandler);
  app.delete('/events/:event_id', deleteEventHandler);
  app.post('/signup', signup);
}
