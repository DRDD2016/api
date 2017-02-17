import client from '../db/client';
import buildFeedItem from './events/build-feed-item';
import getHostId from './events/get-host-id';
import getInviteesIds from './events/get-invitees-ids';
import saveFeedItem from './events/save-feed-item';
import PubSub from 'pubsub-js';
import { UPDATE_FEED } from '../../socket-router';

export function updateAllFeeds (req, res, next) {

  const subject_user_id = req.subject_user_id;
  const event = req.event;
  if (!subject_user_id || !event) {
    res.status(422).json({ error: 'Could not update feeds' });
  }

  buildFeedItem(subject_user_id, event)
  .then((feedItem) => {
    getInviteesIds(client, event.event_id)
    .then((inviteesIds) => {
      saveFeedItem(client, inviteesIds, event.event_id, feedItem)
      .then(() => {
        PubSub.publish(UPDATE_FEED, { ids: inviteesIds, feedItem });
        // end request
        res.status(req.responseStatusCode);
        return req.responseData ?
               res.status(req.responseStatusCode).json(req.responseData) :
               res.status(req.responseStatusCode).end();
      })
      .catch(err => next(err));
    })
    .catch(err => next(err));
  })
  .catch(err => next(err));
}

export function updateHostFeed (req, res, next) {

  const event = req.event;
  const subject_user_id = req.subject_user_id;
  if (!subject_user_id || !event) {
    res.status(422).json({ error: 'Could not update feeds' });
  }

  buildFeedItem(req.subject_user_id, event)
  .then((feedItem) => {
    getHostId(client, event.event_id)
    .then(({ host_user_id }) => {
      saveFeedItem(client, [host_user_id], event.event_id, feedItem)
      .then(() => {
        PubSub.publish(UPDATE_FEED, { ids: [host_user_id], feedItem });
        // end request
        res.status(req.responseStatusCode);
        return req.responseData ?
               res.status(req.responseStatusCode).json(req.responseData) :
               res.status(req.responseStatusCode).end();
      })
      .catch(err => next(err));
    })
    .catch(err => next(err));
  })
  .catch(err => next(err));
}
