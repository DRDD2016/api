import { postEventHandler, getEventHandler, deleteEventHandler } from './handlers';

export default function registerRoutes (app) {
  app.post('/events', postEventHandler);
  app.get('/events/:event_id', getEventHandler);
  app.delete('/events/:event_id', deleteEventHandler);
}
