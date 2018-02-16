import client from '../db/client';
import getEvent from './events/get-event';
import buildFeedItem from './feed/build-feed-item';
import getHostId from './events/get-host-id';
import getInviteesIds from './events/get-invitees-ids';
import saveFeedItem from './feed/save-feed-item';
import PubSub from 'pubsub-js';
import sendPushNotifications from './notifications/push';

export default function updateFeeds (req, res, next) {

  console.log('updatingFeeds');
  console.log('req.subject_user_id', req.subject_user_id);
  console.log('req.event_id', req.event_id);
  console.log('req.informAllInvitees', req.informAllInvitees);
  console.log('req.feedAction', req.feedAction);
  const newInvitee = req.newInvitee;
  const subject_user_id = req.subject_user_id;
  const event_id = req.event_id;
  const informAllInvitees = req.informAllInvitees;
  const action = req.feedAction;

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
        buildFeedItem(subject_user_id, event, action),
        getIds(client, event_id, informAllInvitees)
      ])
      .then(([feedItem, idArray]) => {
        if (!idArray) {
          idArray = [];
        }
        let idArrayTotal = [];
        console.log('newInvitee: ', newInvitee);
        console.log('action: ', action);
        if (newInvitee === undefined) {
          idArrayTotal = idArray;
        }
        if (action !== 'notResponded') {  // adds invitee as receiver if they have just joined an event
          console.log('idArray4a: ', idArray);
          idArray.push(subject_user_id);
          idArrayTotal = idArray;
          console.log('idArrayTotal 4b: ', idArrayTotal);
        }
        if (newInvitee) {  // adds invitee as receiver if they have just joined an event
          console.log('idArray5a: ', idArray);
          console.log('subject_user_id: ', subject_user_id);
          idArray.push(subject_user_id);
          idArrayTotal = idArray;
          console.log('idArrayTotal 2: ', idArrayTotal);
        } else {
          idArrayTotal = idArray;
          console.log('idArrayTotal 3: ', idArrayTotal);
        }


        console.log('idArrayS: ', idArray);
        console.log('idArrayTotalS: ', idArrayTotal);
        console.log('feedItemS: ', feedItem);

        saveFeedItem(client, idArrayTotal, event_id, feedItem)
        .then((returnedFeedItem) => {
          if (returnedFeedItem) {
            console.info('updating feed from updateFeeds...');
            PubSub.publish('UPDATE_FEED', { ids: idArrayTotal, feedItems: [returnedFeedItem] }); // create Feeditems for all ids
            sendPushNotifications(idArray, returnedFeedItem); // only send push to  (non-newInvitees)

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
