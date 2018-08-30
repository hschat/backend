const { authenticate } = require('@feathersjs/authentication').hooks;
const { disallow } = require('feathers-hooks-common');


/**
 * Helper function for replacing a given user id with its database object
 * @param context The context of the request
 * @param id The uuid of the user
 * @returns {Promise<*>} Returns a promise of the function progress
 */
async function replaceUser(context, id) {
  const user = await context.app.service('users').get(id);
  if (Object.prototype.hasOwnProperty.call(user, 'password')) user.password = undefined;
  return user;
}

/**
 *
 * @param context
 * @returns {Promise<*>}
 */
async function resolveUsers(context) {
  const c = context;
  if (Object.prototype.hasOwnProperty.call(c, 'data')) {
    c.result = context.result.data;
  }

  if (Array.isArray(context.result)) {
    // ToDo: check logic
    for (const i in context.result) {
      if (Object.prototype.hasOwnProperty.call(context.result[i], 'sender_id')) {
        c.result[i].sender = await replaceUser(context, context.result[i].sender_id);
        c.result[i].sender_id = undefined;
      }
    }
  }
  return c;
}

async function resolveUsersOfCreate(context){
  context.data.sender=await replaceUser(context, context.data.sender_id);
  context.data.sender_id = undefined;
  return context;
}

async function validateMessage(context) {
  const { data } = context;

  if (!Object.prototype.hasOwnProperty.call(data, 'system')) {
    if (!Object.prototype.hasOwnProperty.call(data, 'sender_id')) return Promise.reject('Invalid message structure!');
  }
  if (!Object.prototype.hasOwnProperty.call(data, 'chat_id')) return Promise.reject('Invalid message structure!');
  if (!Object.prototype.hasOwnProperty.call(data, 'text')) return Promise.reject('Invalid message structure!');
  if (!Object.prototype.hasOwnProperty.call(data, 'send_date')) data.send_date = Date.now();
  context.data = data;
  return context;
}

function updateChat(context) {
  context.app.service('chats').patch(context.data.chat_id, { updated_at: Date.now() });
  return context;
}

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [validateMessage],
    update: [disallow],
    patch: [],
    remove: [disallow],
  },

  after: {
    all: [],
    find: [resolveUsers],
    get: [],
    create: [
      updateChat
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
