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

          // See the "Defining the message payload" section below for details
          // on how to define a message payload.
          const payload = {
            notification: {
              title: "New message from Spark",
              body: message
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

  // Host receives notification
  const { firstname, is_poll, edited, host_user_id, subject_user_id } = returnedFeedItem.feed_item;

  console.log('host_user_id:', host_user_id); // need to determine host/voter and exclude them from some notifications
  console.log('subject_user_id:', subject_user_id);

  if (firstname && is_poll && (id === host_user_id)) {
  message = `${firstname} has voted on your poll `;
  }
  if (firstname && !is_poll && (id === host_user_id)) {
  message = `${firstname} has responded to your event `;
  }

  // Non-Host Invitee receives notification

  if (firstname && is_poll && (id !== host_user_id)) {
  message = `${firstname} wants you to vote on their poll `;
  }
  if (firstname && !is_poll && !edited && (id !== host_user_id)) {
  message = `${firstname} has invited you to their event `;
  }
  if (firstname && !is_poll && edited && (id !== host_user_id)) {
  message = `${firstname} has edited an event `;
  }

  console.log('message: ', message);
  return message;
};

export default sendPushNotifications;
