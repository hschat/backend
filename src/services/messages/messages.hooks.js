const {authenticate} = require('@feathersjs/authentication').hooks;
const {disallow, fastJoin} = require('feathers-hooks-common');

/**
 * Helper function for replacing a given user id with its database object
 * @param context The context of the request
 * @param id The uuid of the user
 * @returns {Promise<*>} Returns a promise of the function progress
 */
async function replaceUser(context, id) {
  let user = await context.app.service('users').get(id);
  if (user.hasOwnProperty('password')) user.password = undefined;
  return user;
}

/**
 *
 * @param context
 * @returns {Promise<*>}
 */
async function resolve_users(context) {
  if(context.result.hasOwnProperty('data')) {
    context.result = context.result.data
  }

  if (Array.isArray(context.result)) {
    for(let i in context.result) {
      if(context.result[i].hasOwnProperty('sender_id')) {
        context.result[i].sender = await replaceUser(context, context.result[i].sender_id);
        context.result[i].sender_id = undefined;
      }
    }
  }
  return context;
}

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

  context.data.recievers = chat.recievers;
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
    find: [],
    get: [],
    create: [validate_message],
    update: [disallow],
    patch: [disallow],
    remove: [disallow]
  },

  after: {
    all: [],
    find: [resolve_users],
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
