const {authenticate} = require('@feathersjs/authentication').hooks;
const {disallow, fastJoin} = require('feathers-hooks-common');
var clone = require('clone');


async function validate_message(context) {
  if (!context.data.hasOwnProperty('sender_id')) return Promise.reject('Invalid message structure!');
  if (!context.data.hasOwnProperty('chat_id')) return Promise.reject('Invalid message structure!');
  if (!context.data.hasOwnProperty('text')) return Promise.reject('Invalid message structure!');
  if (!context.data.hasOwnProperty('send_date')) context.data.send_date = Date.now();
}

async function fetch_chat_data(context) {
  let chat_id = context.data.chat_id;
  let chat = await context.app.service('chats').get(chat_id);

  if (!chat.hasOwnProperty('recievers')) return Promise.reject('Invalid message structure!');

  let recievers = chat.recievers;
  context.data.recievers = recievers;
  return context;
}

async function forward_messages(context) {
  // Publish foreach reciever
  for (let i in context.data.recievers) {
    // Emit event with data
    await context.app.service('messages').publish('created', async (data) => {
      // Search channels for given reciever
      let channel = context.app.channel(context.app.channels).filter(connection => {
        return connection.user.id === data.recievers[i];
      });

      // If no channel was found return undefined
      if (channel === undefined) return undefined;

      // Try to resolve user id to its instance
      let user = await context.app.service('users').get(context.data.sender_id);

      // If no user was found the sender must be undefined
      if (user === undefined) return undefined;
      // Ensure password will not be sent
      if (user.hasOwnProperty('password')) user.password = undefined;

      // Remove unused fields and add required ones
      data.recievers = undefined;
      data.sender_id = undefined;
      data.sender = user;

      return channel;
    });
  }
}

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [disallow],
    get: [],
    create: [validate_message],
    update: [disallow],
    patch: [disallow],
    remove: [disallow]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      fetch_chat_data,
      forward_messages,
    ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
