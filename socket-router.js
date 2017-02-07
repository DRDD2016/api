/* eslint-disable no-console */
const PubSub = require('pubsub-js');
const UPDATE_FEED = 'UPDATE_FEED';
const INIT_FEED = 'INIT_FEED';


module.exports = function socketRouter (io) {

  io.emit('connected');
  console.log("CONNECTION!", io.id);

  io.on(INIT_FEED, (token) => {
    console.log(`user ${token} joined.`);

    // publish the UPDATE_FEED event so the feed is delivered to the client
    PubSub.publish(UPDATE_FEED, [token]);
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
      const feedData = [
        { data: 'somedata' },
        { data: 'somedata' },
        { data: 'somedata' }
      ];
      io.emit(`feed: ${token}`, feedData);
    });
  });
};
