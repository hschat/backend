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
async function resolve_users_find(context) {
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

async function resolve_users_create(context){
  context.data.sender=await replaceUser(context, context.data.sender_id);
  context.data.sender_id = undefined;
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
    find: [resolve_users_find],
    get: [],
    create: [
      update_chat
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
