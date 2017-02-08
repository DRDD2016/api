/* eslint-disable no-console */
const PubSub = require('pubsub-js');
const UPDATE_FEED = 'UPDATE_FEED';
const INIT_FEED = 'INIT_FEED';

const feedItem = [{
  event_id: 'event:112',
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
  name: 'Day trip'
}];


module.exports = function socketRouter (io) {

  io.emit('connected');
  console.log("CONNECTION!", io.id);

  io.on(INIT_FEED, (token) => {
    console.log(`user ${token} joined.`);
    // publish the UPDATE_FEED event so the feed is delivered to the client
    setInterval(() => {

      PubSub.publish(UPDATE_FEED, [token]);
    }, 10000);
  });

  io.on('disconnect', () => {
    // disconnect from pubsub
    console.log('DISCONNECTED');
  });

  PubSub.subscribe(UPDATE_FEED, (msg, data) => {
    console.log('msg', msg, 'data', data);

    data.forEach((token) => {
      // get feed from database
      // on error, io.emit('failure')
      io.emit(`feed: ${token}`, feedItem);
    });
  });
};
