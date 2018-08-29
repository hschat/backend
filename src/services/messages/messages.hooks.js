const { authenticate } = require('@feathersjs/authentication').hooks;
const { disallow, fastJoin } = require('feathers-hooks-common');

/**
 * Helper function for replacing a given user id with its database object
 * @param context The context of the request
 * @param id The uuid of the user
 * @returns {Promise<*>} Returns a promise of the function progress
 */
async function replaceUser(context, id) {
  const user = await context.app.service('users').get(id);
  if (user.hasOwnProperty('password')) user.password = undefined;
  return user;
}

/**
 *
 * @param context
 * @returns {Promise<*>}
 */
async function resolve_users(context) {
  if (context.result.hasOwnProperty('data')) {
    context.result = context.result.data;
  }

  if (Array.isArray(context.result)) {
    for (const i in context.result) {
      if (context.result[i].hasOwnProperty('sender_id')) {
        context.result[i].sender = await replaceUser(context, context.result[i].sender_id);
        context.result[i].sender_id = undefined;
      }
    }
  }
  return context;
}

async function validate_message(context) {
  if (!context.data.hasOwnProperty('system')) {
    if (!context.data.hasOwnProperty('sender_id')) return Promise.reject('Invalid message structure!');
  }
  if (!context.data.hasOwnProperty('chat_id')) return Promise.reject('Invalid message structure!');
  if (!context.data.hasOwnProperty('text')) return Promise.reject('Invalid message structure!');
  if (!context.data.hasOwnProperty('send_date')) context.data.send_date = Date.now();
  return context;
}

async function forward_messages(context) {
  const chat_id = context.data.chat_id;
  const chat = await context.app.service('chats').get(chat_id);

  if (!chat.hasOwnProperty('participants')) return Promise.reject('Invalid message structure!');

  /*
  let sender = chat.participants.indexOf(context.data.sender_id);
  if (sender !== -1) chat.participants.splice(sender, 1);
  */

  context.data.participants = chat.participants;

  // Publish foreach reciever
  for (const i in context.data.participants) {
    // Emit event with data
    await context.app.service('messages').publish('created', async (data) => {
      // Search channels for given participant
      const channel = context.app.channel(context.app.channels).filter(connection => (context.data.participants.indexOf(connection.user.id) !== -1));

      // If no channel was found return undefined
      if (channel === undefined) return undefined;

      // Try to resolve user id to its instance
      if (!context.data.system) {
        const user = await context.app.service('users').get(context.data.sender_id);


        // If no user was found the sender must be undefined
        if (user === undefined) return undefined;
        // Ensure password will not be sent
        if (user.hasOwnProperty('password')) user.password = undefined;

        // Remove unused fields and add required ones
        data.participants = undefined;
        data.sender_id = undefined;
        data.sender = user;
      }

      return channel;
    });
  }
  return context;
}

function update_chat(context) {
  context.app.service('chats').patch(context.data.chat_id, { updated_at: Date.now() });
  return context;
}

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [validate_message],
    update: [disallow],
    patch: [],
    remove: [disallow],
  },

  after: {
    all: [],
    find: [resolve_users],
    get: [],
    create: [
      update_chat,
      forward_messages,
    ],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
