import * as admin from "firebase-admin";
import client from '../../db/client';
import getPushTokenById from '../auth/get-pushToken-by-id';
import initialiseFCM from './push-setup';

//  * Sends Push Notifications to relevant users
//  * @returns {object} notification
//  * @param {object} returnedFeedItem - feed item.

initialiseFCM();

const sendPushNotifications = (idArray, returnedFeedItem) => {

  let notifications = new Promise((resolve, reject) => {
    let notifs = idArray.map((id) => {
      console.info('iterating id: ', id);

      // check if user has registered a push token for notifications

      getPushTokenById(client, id)
      .then((token) => {
        console.log('token: ', token);
        if (token) {
          console.log('pushToken: ', token);

          let registrationToken = token.push_info;
          console.log('registrationToken: ', registrationToken);

          let message = getMessage(id, returnedFeedItem);

          // if message is null, then do not send push notification
          if (message === null) {
            return;
          }
          // otherwise send it

          // use tag to only keep latest notification relating to each event and subject user
          let tagName = `${returnedFeedItem.event_id}_${returnedFeedItem.subject_user_id}`;

          // See the "Defining the message payload" section below for details
          // on how to define a message payload.
          const payload = {
            notification: {
              title: "New message from Spark",
              body: message,
              icon: "ic_notif",
              color: '#7D3E98',
              tag: tagName,
              sound: 'default'
            }
          };
          // use returnedFeedItem to construct payload

          console.log('sendingToDevice payload: ', payload);
          console.log('sendingToDevice registrationToken: ', registrationToken);

          const options = {
            priority: "high"
          };

          admin.messaging().sendToDevice(registrationToken, payload, options)
            .then(function (response) {
              // See the MessagingDevicesResponse reference documentation for
              // the contents of response.
              console.info("Successfully sent message:", response);
            })
            .catch(function (error) {
              console.info("Error sending message:", error);
            });




          return;
        }
        return;
      })
      .catch((err) => {
        console.log('Unable to get PushToken: ', err);

      });

    });
    if(notifs) {
      console.log('notifs: ', notifs);
      resolve(notifs);
    } else {
      reject('error: unable to create notifications array');
    }

  });

};

const getMessage = (id, returnedFeedItem) => {
  let message = '';

  console.log('returnedFeedItem:', returnedFeedItem);

  // Host receives notification
  const { firstname, is_poll, edited, host_user_id, subject_user_id, action, cancelled } = returnedFeedItem.feed_item;

  console.log('host_user_id:', host_user_id); // need to determine host/voter and exclude them from some notifications
  console.log('subject_user_id:', subject_user_id);
  console.log('action:', action);
  console.log('id:', id); // to send message

  const userIsSubject = subject_user_id === id;
  const userIsHost = host_user_id === id;
  const isCancelled = cancelled;


// new


  // notifications for feed only, make push message null

  if (userIsSubject) {
    message = null;
  }
  if (!userIsSubject && userIsHost && !is_poll && (action === 'notResponded')) {
    message = null;
    // message = `${firstname} has joined but not responded to your event `;
  }
  if (!userIsSubject && userIsHost && is_poll && (action === 'notResponded')) {
    message = null;
    // message = `${firstname} has joined but not responded to a poll `;
  }
  if (!userIsSubject && !userIsHost && is_poll && !isCancelled && (action === 'notResponded')) {
    message = null;
    // message = `${firstname} wants you to vote on their poll `;
  }
  if (!userIsSubject && !userIsHost && !is_poll && !edited && !isCancelled && (action === 'notResponded')) {
    message = null;
    // message = `${firstname} has invited you to `;
  }


  // notifications to send, make message relevant to feed item

  if (!userIsSubject && userIsHost && is_poll && (action === 'vote')) {
    message = `${firstname} has voted on your poll `;
  }
  if (!userIsSubject && userIsHost && !is_poll && (action === 'rsvp')) {
    message = `${firstname} has responded to your event `;
  }
  if (!userIsSubject && !userIsHost && !isCancelled && (action === 'finalised')) {
    message = `${firstname} has confirmed an event `;
  }
  if (!userIsSubject && !userIsHost && !is_poll && edited && !isCancelled && (action === 'edited')) {
    message = `${firstname} has edited an event `;
  }
  if (!userIsSubject && !userIsHost && !is_poll && isCancelled) {
    message = `${firstname} has cancelled an event `;
  }

  // add "has confirmed an event after a poll"

  console.log('message: ', message);
  return message;
};

export default sendPushNotifications;
