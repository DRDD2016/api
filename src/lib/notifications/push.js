// import { push } from './push-setup';
// /**
//  * Sends Push Notifications to relevant users
//  * @returns {object} notification
//  * @param {object} returnedFeedItem - feed item.
//  */
//
// export default function sendPushNotifications (idArray, returnedFeedItem) {
//   console.log(idArray);
//   console.log(returnedFeedItem);
//   console.log('sending push notification to AllInvitees...');
//
//     // Set Multiple destinations
//   const registrationIds = idArray;
//   // registrationIds.push('INSERT_YOUR_DEVICE_ID');
//   // registrationIds.push('INSERT_OTHER_DEVICE_ID');
//
//   // send push notification based on contents of returnedFeedItem.
//   const { firstname, is_poll, edited, host_user_id, subject_user_id } = returnedFeedItem.feed_item;
//
//   console.log('host_user_id:', host_user_id); // need to determine host/voter and exclude them from some notifications
//   console.log('subject_user_id:', subject_user_id);
//
//   let notification = '';
//
//   // You receive notification
//
//   // if (firstname && is_poll) {
//   //   notification = `${firstname} have created a poll `;
//   // }
//   // if (firstname && !is_poll && !edited) {
//   //   notification = `${firstname} have created an event `;
//   // }
//   // if (firstname && !is_poll && edited) {
//   //   notification = `${firstname} have edited an event `;
//   // }
//
//   // Host receives notification
//   if (firstname && is_poll) {
//     notification = `${firstname} has voted on your poll `;
//   }
//   if (firstname && !is_poll) {
//     notification = `${firstname} has responded to your event `;
//   }
//
//   // Non-Host Invitee receives notification
//   if (firstname && is_poll) {
//     notification = `${firstname} wants you to vote on their poll `;
//   }
//   if (firstname && !is_poll && !edited) {
//     notification = `${firstname} has invited you to their event `;
//   }
//   if (firstname && !is_poll && edited) {
//     notification = `${firstname} has edited an event `;
//   }
//
//   console.log(notification);
//   // end refactor send push notification
//
//   push.send(registrationIds, data)
//       .then((results) => {
//         console.log('push results', results);
//       })
//       .catch((err) => {
//         console.log('push error', err);
//       });
//
//   return;
// }
//
// const data = {
//     title: 'New push notification', // REQUIRED
//     body: 'message from Spark', // REQUIRED
//     custom: {
//         sender: 'Spark',
//     },
//     priority: 'high', // gcm, apn. Supported values are 'high' or 'normal' (gcm). Will be translated to 10 and 5 for apn. Defaults to 'high'
//     retries: 1, // gcm, apn
//     sound: 'ping.aiff', // gcm, apn
//     alert: {}, // apn, will take precedence over title and body
//     // alert: '', // It is also accepted a text message in alert
// };
