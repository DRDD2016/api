/* eslint-disable no-console */
import PubSub from 'pubsub-js';
export const UPDATE_FEED = 'UPDATE_FEED';
const INIT_FEED = 'INIT_FEED';
//
const feedItem = {
  event_id: 3,
  timestamp: new Date().toISOString(),
  firstname: 'Bob',
  surname: 'Dylan',
  photo_url: 'http://placehold.it/100x100',
  what: [
    'Go to France'
  ],
  where: [
    new Date().toISOString()
  ],
  when: [new Date().toISOString()],
  is_poll: false,
  host_user_id: '10156727442325251',
  subject_user_id: '10156727442325251',
  viewed: true,
  inviteesNumber: 24,
  name: 'Day trip to France'
};


module.exports = function socketRouter (io) {

  io.emit('connected');
  console.log("CONNECTION!", io.id);

  // received user_id from client
  io.on(INIT_FEED, (user_id) => {
    console.log(`user ${user_id} joined.`);
    // publish the UPDATE_FEED event so the feed is delivered to the client
    PubSub.publish(UPDATE_FEED, { ids: [user_id], feedItem });
      // io.emit(`feed:${user_id}`, []);
  });

  io.on('disconnect', () => {
    // disconnect from pubsub
    console.log('DISCONNECTED');
  });

  PubSub.subscribe(UPDATE_FEED, (msg, data) => {
    console.log('msg', msg, 'data', data);

    data.ids.forEach((id) => {
      // get feed from database
      // on error, io.emit('failure')
      io.emit(`feed:${id}`, [data.feedItem]);
    });
  });
};
