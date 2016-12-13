import { postEventHandler, getEventHandler } from './handlers';

export default function registerRoutes (app) {
  app.post('/events', postEventHandler);
  app.get('/events/:event_id', getEventHandler);
}
