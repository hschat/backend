module.exports = function (app) {

  /**
   * helper function to join a user all the channels he belongs to
   * @param user the user who has to join his channels
   * @param connection connection object of the user
   */
  const joinChannels = async (user, connection) => {
    // Add it to the authenticated user channel
    app.channel('authenticated').join(connection);

    // Join admin channel
    if (user.role === 'admin') {
      app.channel('admins').join(connection);
    }

    // find all chats for the user
    let chats = await app.service('chats').find({query: {participants: {$contains: [user.id]}}});
    chats.data.forEach(chat => {
      app.channel(`chats/${chat.id}`).join(connection)
      //setTimeout( console.log('SCHAU MAL AN WER DA IS', app.channel(`chats/${chat.id}`)),100)
    });

  };

  /**
   * kicks a users out of all channels
   * @param user
   */
  const leaveChannels = user => {
    return app.channel(app.channels).leave(connection =>
      connection.user.id === user.id
    );
  };

  /**
   * helper function if the channel informations of a user chances
   * leaves and reenter all channels
   * @param user
   */
  const updateChannels = async user => {
    // Find all connections for this user
    const {connections} = app.channel(app.channels).filter(connection =>
      connection.user.id === user.id
    );

    // Leave all channels
    await leaveChannels(user);

    // Re-join all channels with the updated user information
    await connections.forEach(connection => joinChannels(user, connection));
  };

  app.on('connection', connection => {
    // On a new real-time connection, add it to the
    // anonymous channel
    app.channel('anonymous').join(connection);
  });

  app.on('login', async (payload, {connection}) => {
    // connection can be undefined if there is no
    // real-time connection, e.g. when logging in via REST
    if (connection) {
      const {user} = connection;
      // The connection is no longer anonymous, remove it
      app.channel('anonymous').leave(connection);
      joinChannels(user, connection)
    }
  });

  app.publish((data, hook) => { // eslint-disable-line no-unused-vars
    // Here you can add event publishers to channels set up in `channels.js`
    // To publish only for a specific event use `app.publish(eventname, () => {})`

    // publish all service events to all authenticated users users
    // return app.channel('authenticated');
  });

  // When a user is removed, make all their connections leave every channel
  app.service('users').on('removed', user => {
    leaveChannels(user);
  });


  // Register created event for a chat
  app.service('chats').publish('created', (data) => {
    console.log('HAAALLOOOOO', data);
    return app.channel(`chats/${data.id}`);
  });

  app.service('messages').publish('created', async(data) => {
    data.sender= await app.service('users').get(data.sender_id);
    data.sender_id = undefined;
    return app.channel(`chats/${data.chat_id}`);
  });

  app.service('chats').hooks({
    after: {
      async create(context) {
        const { result } = context;
        const participantIds = result.participants.map(participant => participant.id);
        const { connections } = app.channel(app.channels).filter(connection =>
          participantIds.includes(connection.user.id)
        );

        app.channel(`chats/${result.id}`).join(...connections);
        return context;
      }
    }
  });

  // for a specific event
  // app.service('name').publish(eventName, (data, hook) => {});

  // For all events on that service
  // app.service('name').publish((data, hook) => {});
};
