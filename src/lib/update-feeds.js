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
        console.log('event.rsvps.notResponded:', event.rsvps.notResponded);

        const notResponded = event.rsvps.notResponded;
        const included = notResponded.some(user => user.user_id === subject_user_id);

        console.log('included: ', included);

        if (included) {  // adds invitee as receiver if they have just joined an event, but not responded
          const idArray2 = subject_user_id;
          const idArrayTotal = idArray.push(subject_user_id);
        } else {
          const idArrayTotal = idArray;
        }


        console.log('idArray: ', idArray);
        console.log('idArray2: ', idArray2);
        console.log('idArrayTotal: ', idArrayTotal);
        console.log('feedItem: ', feedItem);

        saveFeedItem(client, idArrayTotal, event_id, feedItem)
        .then((returnedFeedItem) => {
          if (returnedFeedItem) {
            console.info('updating feed from updateFeeds...');
            PubSub.publish('UPDATE_FEED', { ids: idArrayTotal, feedItems: [returnedFeedItem] }); // create Feeditems for all ids
            sendPushNotifications(idArray, returnedFeedItem); // only send push to idArray

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
