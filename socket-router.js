/* eslint-disable no-console */
import PubSub from 'pubsub-js';
import client from './src/db/client';
import getFeedItems from './src/lib/feed/get-feed-items';
export const UPDATE_FEED = 'UPDATE_FEED';
const INIT_FEED = 'INIT_FEED';


module.exports = function socketRouter (io) {

  io.emit('connected');
  console.log("CONNECTION!", io.id);

  io.on(INIT_FEED, (user_id) => {
    console.log(`user ${user_id} joined.`);
    getFeedItems(client, user_id)
    .then((feedItems) => {
      if (feedItems) {

        PubSub.publish(UPDATE_FEED, { ids: [user_id], feedItems });
      } else {
        io.emit(`failure:${user_id}`, new Error('Could not get feed items'));
      }
    });
  });

  io.on('disconnect', () => {
    // disconnect from pubsub
    console.log('DISCONNECTED');
  });

  PubSub.subscribe(UPDATE_FEED, (msg, data) => {
    console.log(msg, 'data', data);

    data.ids.forEach((id) => {
      // get feed from database
      io.emit(`feed:${id}`, data.feedItems);
    });
  });
};
