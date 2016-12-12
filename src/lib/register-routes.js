import { postEvent } from './handlers';

export default function registerRoutes (app) {
  app.post('/events', postEvent);
}
