module.exports = function socketRouter (io) {
  io.emit('connected');
  console.log("CONNECTION!", io.id);
  io.on('join', (user_id) => {
    console.log(`user ${user_id} joined.`);
    // publish the "notify" event so the feed is delivered to the client
    // pub.publish('notify', JSON.stringify([user_id]));
  });
  io.on('disconnect', () => {
    console.log('DISCONNECTED');
  });
  /*
  sub.on('message', (channel, message))
    switch (channel) {
      case 'failure':
        io.emit('failure', message);
        break;

      case 'notify':
        JSON.parse(message).forEach((user_id) => {
          // get feed data for each person, then:
          io.emit('feed', feedData);
        });
        break;
  }

   */
};
