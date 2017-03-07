/* eslint-disable no-console */
import PubSub from 'pubsub-js';
import client from './src/db/client';
import getFeedItems from './src/lib/feed/get-feed-items';
export const UPDATE_FEED = 'UPDATE_FEED';
const HYDRATE_FEED = 'HYDRATE_FEED';
const INIT_FEED = 'INIT_FEED';


module.exports = function socketRouter (io) {

  io.emit('connected');
  console.log("CONNECTION!", io.id);

  io.on(INIT_FEED, (user_id) => {
    console.log('INIT_FEED');
    console.log(`user ${user_id} joined.`);
    getFeedItems(client, user_id)
    .then((feedItems) => {
      if (feedItems) {
        console.log('hydrating feed...');
        PubSub.publish(HYDRATE_FEED, { ids: [user_id], feedItems });
      } else {
        io.emit(`failure:${user_id}`, new Error('Could not get feed items'));
      }
    });
  });

  PubSub.subscribe(HYDRATE_FEED, (msg, data) => {
    console.log('NUM FEED ITEMS', data.feedItems.length);
    data.ids.forEach((id) => {
      // get feed from database
      io.emit(`hydrateFeed:${id}`, data.feedItems);
    });
  });

  PubSub.subscribe(UPDATE_FEED, (msg, data) => {
    console.log(msg, 'data', data);
    console.log('NUM FEED ITEMS', data.feedItems.length);
    data.ids.forEach((id) => {
      // get feed from database
      io.emit(`feed:${id}`, data.feedItems);
    });
  });

  io.on('disconnect', () => {
    // disconnect from pubsub
    PubSub.unsubscribe(HYDRATE_FEED);
    PubSub.unsubscribe(UPDATE_FEED);
    console.log('DISCONNECTED');
  });
};
