import client from '../db/client';
import getEvent from './events/get-event';
import buildFeedItem from './feed/build-feed-item';
import getHostId from './events/get-host-id';
import getInviteesIds from './events/get-invitees-ids';
import saveFeedItem from './feed/save-feed-item';
import PubSub from 'pubsub-js';

const informCurrentUser = (method, url) => {
  if (method === 'POST' || method === 'PUT') {
    if ((/\/events\/\d+$/).test(url) || (/\/events$/).test(url)) {
      return true;
    }
  }
  return false;
};

export default function updateFeeds (req, res, next) {

  const subject_user_id = req.subject_user_id;
  const event_id = req.event_id;
  const informAllInvitees = req.informAllInvitees;

  if (!subject_user_id || !event_id || informAllInvitees === undefined) {
    return res.status(422).json({ error: 'Could not update feeds' });
  }

  const getIds = (client, event_id, informAllInvitees) => {
    return informAllInvitees ?
      getInviteesIds(client, event_id) :
      getHostId(client, event_id);
  };

  getEvent(client, event_id)
  .then((event) => {
    if (event) {
      Promise.all([
        buildFeedItem(subject_user_id, event),
        getIds(client, event_id, informAllInvitees)
      ])
      .then(([feedItem, idArray]) => {
        if (!idArray) {
          idArray = [];
        }
        console.log('first step');
        // if this user has just created or edited their own event:
        if (informCurrentUser(req.method, req.url) && !idArray.includes(subject_user_id)) {
          console.log('second step');
          idArray.push(subject_user_id);
        }

        saveFeedItem(client, idArray, event_id, feedItem)
        .then((returnedFeedItem) => {
          if (returnedFeedItem) {
            console.log('third step');
            PubSub.publish('UPDATE_FEED', { ids: idArray, feedItems: [returnedFeedItem] });
          }
          res.status(req.responseStatusCode).send(req.responseData);
        })
        .catch(err => next(err));
      })
      .catch(err => next(err));
    } else {
      return res.status(422).json({ error: 'Could not get event; could not update feeds' });
    }
  })
  .catch(err => next(err));
}
