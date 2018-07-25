module.exports = function(app) {
  app.on('connection', connection => {
    // On a new real-time connection, add it to the
    // anonymous channel
    app.channel('anonymous').join(connection);
  });

  app.on('login', (payload, { connection }) => {
    // connection can be undefined if there is no
    // real-time connection, e.g. when logging in via REST
    if(connection) {
      const {user} = connection;
      // The connection is no longer anonymous, remove it
      app.channel('anonymous').leave(connection);

      // Add it to the authenticated user channel
      app.channel('authenticated').join(connection);

      // Channels can be named anything and joined on any condition
      // E.g. to send real-time events only to admins use
      if(user.role==='admin') { app.channel('admins').join(connection); }

      // If the user has joined e.g. chat rooms

      // user.rooms.forEach(room => app.channel(`rooms/${room.id}`).join(channel))
    }
  });

  app.publish((data, hook) => { // eslint-disable-line no-unused-vars
  // Here you can add event publishers to channels set up in `channels.js`
  // To publish only for a specific event use `app.publish(eventname, () => {})`

  // publish all service events to all authenticated users users
  // return app.channel('authenticated');
  });

  // you can also add service specific publisher via

  // for a specific event
  // app.service('name').publish(eventName, (data, hook) => {});

  // For all events on that service
  // app.service('name').publish((data, hook) => {});
};
