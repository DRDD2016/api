import PubSub from 'pubsub-js';
import { UPDATE_FEED } from '../../socket-router';
import saveEvent from './events/save-event';
import getEvent from './events/get-event';
import getUserById from './auth/get-user-by-id';
import updateUser from './auth/update-user';
import deleteEvent from './events/delete-event';
import addInvitee from './events/add-invitee';
import getEventByCode from './events/get-event-by-code';
import saveVote from './events/save-vote';
import finaliseEvent from './events/finalise-event';
import getRsvps from './events/get-rsvps';
import getEventInvitees from './events/get-invitees-ids';
import updateRsvp from './events/update-rsvp';
import saveFeedItem from './events/save-feed-item';
import editEvent from './events/edit-event';
import buildFeedItem from './events/build-feed-item';
import normaliseEventKeys from './normalise-event-keys';
import client from '../db/client';
import shortid from 'shortid';

export function postEventHandler (req, res, next) { // eslint-disable-line no-unused-vars
  const event = req.body.event;
  if (!event) {
    return res.status(422).send({ error: 'Missing event data' });
  }
  const data = Object.assign(event, { host_user_id: req.user.user_id });
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

export function deleteEventHandler (req, res, next) {
  deleteEvent(client, req.params.event_id)
  .then((deleted_event_id) => {
    res.json(deleted_event_id);
  })
  .catch(err => next(err));
}

export function getEventHandler (req, res, next) {
  getEvent(client, req.params.event_id)
  .then((event) => {
    if (event) {
      req.event = event;
      next();
    } else {
      return res.status(422).send({ error: 'Could not get event' });
    }
  })
  .catch(err => next(err));
}

export function addRsvps (req, res, next) {
  getRsvps(client, req.event.event_id)
  .then((rsvps) => {
    req.event.rsvps = rsvps;
    return req.method === 'POST' ? res.status(201).json(req.event) : res.json(req.event);
  })
  .catch(err => next(err));
}

export function postRsvpsHandler (req, res, next) {
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
          req.event = normaliseEventKeys(event);
          next();
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
}

export function patchRsvpsHandler (req, res, next) {
  const rsvpStatus = req.body.status;
  if (!rsvpStatus) {
    return res.status(422).send({ error: 'Missing rsvp data' });
  }
  updateRsvp(client, req.user.user_id, req.params.event_id, rsvpStatus)
    .then(() => {
      getRsvps(client, req.params.event_id)
      .then((rsvps) => {
        return res.status(201).json({ rsvps });
      })
      .catch(err => next(err));
    })
    .catch(err => next(err));
}

export function postVoteHandler (req, res, next) {
  const user_id = req.user.user_id;
  const vote  = req.body.vote;
  const event_id = req.params.event_id;
  saveVote(client, user_id, event_id, vote)
    .then((success) => {
      if (success) {
        res.status(201).end();
      }
    })
    .catch(err => next(err));
}

export function finaliseEventHandler (req, res, next) {
  const hostEventChoices = req.body.hostEventChoices;
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

export function getInviteesHandler (req, res, next) {
  const event_id = req.params.event_id;
  getRsvps(client, event_id)
    .then((data) => {
      if (data) {
        return res.json(data);
      } else {
        return res.status(422).send({ error: 'Could not get invitees' });
      }
    })
    .catch(err => next(err));
}

export function putEventHandler (req, res, next) {
  const event_id = req.params.event_id;
  const event = req.body.event;
  const host_user_id = req.user.user_id;
  editEvent(client, event_id, event)
    .then((data) => {
      if (data) {
        // create feed item
        buildFeedItem(host_user_id, event)
        .then((feedItem) => {
          getEventInvitees(client, event_id)
          .then((inviteesIds) => {
            saveFeedItem(client, inviteesIds, event_id, feedItem)
            .then(() => {
              // push feed items to clients
              PubSub.publish(UPDATE_FEED, { ids: inviteesIds, feedItem });
            })
            .catch(err => next(err));
          })
          .catch(err => next(err));

          return res.status(201).json(data);
        })
        .catch(err => next(err));

      } else {
        return res.status(422).send({ error: 'Could not edit event' });
      }
    })
    .catch(err => next(err));
}

export function getUserHandler (req, res, next) {
  getUserById(client, req.params.user_id)
  .then((user) => {
    if (user) {
      return res.json(user);
    } else {
      return res.status(422).send({ error: 'Could not get user' });
    }
  })
  .catch(err => next(err));
}

export function patchUserHandler (req, res, next) {
  const userData = req.body;
  const user_id = req.params.user_id;
  updateUser(client, user_id, userData)
    .then((data) => {
      if (data) {
        return res.json(data);
      } else {
        return res.status(422).send({ error: 'Could not update user' });
      }
    })
    .catch(err => next(err));
}
