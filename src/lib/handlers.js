import saveEvent from './events/save-event';
import getEvent from './events/get-event';
import deleteEvent from './events/delete-event';
import addInvitee from './events/add-invitee';
import getEventByCode from './events/get-event-by-code';
import saveVote from './events/save-vote';
import finaliseEvent from './events/finalise-event';
import normaliseEventKeys from './normalise-event-keys';
import client from '../db/client';
import shortid from 'shortid';

export function postEventHandler (req, res, next) { // eslint-disable-line no-unused-vars
  const data = Object.assign(req.body, { host_user_id: req.user.user_id });
  const code = shortid.generate();
  data.code = code;
  saveEvent(client, data)
    .then(() => {
      res.json({ code });
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

export function addInviteeHandler (req, res, next) {
  const code = req.body.code;
  if (!code) {
    return res.status(422).send({ error: 'No code submitted' });
  }
  getEventByCode(client, code)
    .then((event) => {
      if (!event) {
        return res.status(422).send({ error: 'No event found' });
      }
      addInvitee(client, req.user.user_id, event.event_id)
        .then(() => {
          return res.status(201).json(JSON.stringify(normaliseEventKeys(event)));
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
}

export function postVoteHandler (req, res, next) {
  const user_id = req.user.user_id;
  const { event_id, vote } = req.body;
  saveVote(client, user_id, event_id, vote)
    .then((success) => {
      if (success) {
        res.status(201).end();
      }
    })
    .catch(err => next(err));
}

export function patchEventHandler (req, res, next) {
  const hostEventChoices = req.body;
  const event_id = req.params.event_id;
  finaliseEvent(client, event_id, hostEventChoices)
    .then((data) => {
      if (data) {
        return res.json(data);
      } else {
        return res.status(422).send({ error: 'Could not finalise event' });
      }
    })
    .catch(err => next(err));
}
