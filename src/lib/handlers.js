import saveEvent from './event/save-event';
import getEvent from './event/get-event';
import client from '../db/client';

export function postEventHandler (req, res) {
  saveEvent(client, req.body)
    .then(() => {
      res.end();
    })
    .catch((error) => {
      res.end(error);
    });
}

export function getEventHandler (req, res) {
  getEvent(client, req.params.event_id)
    .then((event) => {
      res.json(event);
    })
    .catch((err) => {
      res.end(err);
    });
}
