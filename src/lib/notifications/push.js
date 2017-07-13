import * as admin from "firebase-admin";

//  * Sends Push Notifications to relevant users
//  * @returns {object} notification
//  * @param {object} returnedFeedItem - feed item.

const sendPushNotifications = (idArray, returnedFeedItem) => {

  console.log(idArray);
  console.log(returnedFeedItem);
  console.log('sending push notification to AllInvitees...');
  let notifications = buildNotifications(idArray, returnedFeedItem);

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FCM_PROJECT_ID,
      clientEmail: process.env.FCM_CLIENT_EMAIL,
      privateKey: process.env.FCM_PRIVATE_KEY
    }),
    databaseURL: process.env.FCM_DATABASE
  });
  console.log('finishedInitialisingApp');

  sendNotifications(notifications);

};

const sendNotifications = (notifications) => {
  notifications.map((notification) => {
    let registrationToken = notification.receiverId;
    let message = notification.message;

    // See the "Defining the message payload" section below for details
    // on how to define a message payload.
    const payload = {
      notification: {
        title: "New message from Spark",
        body: message
      }
    };
    // use returnedFeedItem to construct payload

    const options = {
      priority: "high"
    };

    admin.messaging().sendToDevice(registrationToken, payload, options)
      .then(function (response) {
        // See the MessagingDevicesResponse reference documentation for
        // the contents of response.
        console.log("Successfully sent message:", response);
      })
      .catch(function (error) {
        console.log("Error sending message:", error);
      });
  });
};


const buildNotifications = (idArray, returnedFeedItem) => {
  // add Who will receive logic here
  const { firstname, is_poll, edited, host_user_id, subject_user_id } = returnedFeedItem.feed_item;

  console.log('host_user_id:', host_user_id); // need to determine host/voter and exclude them from some notifications
  console.log('subject_user_id:', subject_user_id);
  let message = '';
  let notificationsObj = '';

  let notifications = idArray.map((id) => {
    console.log(id);

    // logic here

    // Host receives notification

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

    // logic above


    let notification = {
      receiverId: id,
      message: message
    };

    notificationsObj.push(notification);

    return notificationsObj;
  });

  return notifications;

};

export default sendPushNotifications;
