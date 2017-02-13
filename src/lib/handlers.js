import PubSub from 'pubsub-js';
import { UPDATE_FEED } from '../../socket-router';
import saveEvent from './events/save-event';
import getEvent from './events/get-event';
import deleteEvent from './events/delete-event';
import addInvitee from './events/add-invitee';
import getEventByCode from './events/get-event-by-code';
import saveVote from './events/save-vote';
import finaliseEvent from './events/finalise-event';
import getRsvps from './events/get-rsvps';
import getEventInvitees from './events/get-invitees-ids';
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

export function getEventHandler (req, res, next) {
  Promise.all([
    getEvent(client, req.params.event_id),
    getRsvps(client, req.params.event_id)
  ])
    .then(([event, rsvps]) => {
      if (event && rsvps) {
        console.log(event, rsvps);
        event.rsvps = rsvps;
        return res.json(event);
      } else {
        return res.status(422).send({ error: 'Could not get event' });
      }
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
          return res.status(201).json(normaliseEventKeys(event));
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
}

export function patchRsvpsHandler (req, res, next) { // eslint-disable-line
  const rsvp = req.body.rsvp;
  if (!rsvp) {
    return res.status(422).send({ error: 'Missing rsvp data' });
  }
  // saveRsvps(client, req.user.user_id, req.params.event_id)
  //   .then(() => {
  //     return res.status(201).json(normaliseEventKeys(event));
  //   })
  //   .catch(err => next(err));
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
