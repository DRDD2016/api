import saveEvent from './events/save-event';
import getEvent from './events/get-event';
import deleteEvent from './events/delete-event';
import client from '../db/client';

export function postEventHandler (req, res, next) {
  const data = Object.assign(req.body, { user_id: req.user.user_id });
  saveEvent(client, data)
    .then(() => {
      res.json({ code: "pretend code" });
    })
    .catch((err) => {
      return res.status(500).send({ error: err });
    });
}

export function getEventHandler (req, res, next) {
  getEvent(client, req.params.event_id)
    .then((event) => {
      res.json(JSON.stringify(event));
    })
    .catch(err => next(err));
}

export function deleteEventHandler (req, res, next) {
  deleteEvent(client, req.params.event_id)
    .then((deleted_event_id) => {
      res.json(deleted_event_id);
    })
    .catch(err => next(err));
}
