import saveEvent from './event/save-event';
import client from '../db/client';

export function postEvent (req, res) {
  saveEvent(client, req.body)
    .then(() => {
      res.end();
    });
}
