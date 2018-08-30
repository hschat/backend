const { authenticate } = require('@feathersjs/authentication').hooks;
const { disallow } = require('feathers-hooks-common');


/**
 * Helper function for replacing a given user id with its database object
 * @param context The context of the request
 * @param id The uuid of the user
 * @returns {Promise<*>} Returns a promise of the function progress
 */
async function replaceUser(context, id) {
  const user = await context.app.service('users')
    .get(id);
  if (Object.prototype.hasOwnProperty.call(user, 'password')) user.password = undefined;
  return user;
}

/**
 *
 * @param context
 * @returns {Promise<*>}
 */
async function resolveUsers(context) {
  const ctx = context;
  if (Object.prototype.hasOwnProperty.call(ctx, 'data')) {
    ctx.result = context.result.data;
  }

  if (Array.isArray(context.result)) {
    for (const i in Object.keys(context.result)) {
      if (Object.prototype.hasOwnProperty.call(context.result[i], 'sender_id')) {
        // ToDo: Improve execution speed by parallelization (no-await-in-loop)
        ctx.result[i].sender = await replaceUser(context, context.result[i].sender_id);
        ctx.result[i].sender_id = undefined;
      }
    }
  }
  return ctx;
}

// ToDo: Evaluate the necessity of the function below
// eslint-disable-next-line no-unused-vars
async function resolveUsersOfCreate(context) {
  const ctx = context;
  ctx.data.sender = await replaceUser(ctx, ctx.data.sender_id);
  ctx.data.sender_id = undefined;
  return ctx;
}

async function validateMessage(context) {
  const ctx = context;
  const { data } = context;

  if (!Object.prototype.hasOwnProperty.call(data, 'system')) {
    if (!Object.prototype.hasOwnProperty.call(data, 'sender_id')) {
      return Promise.reject(new TypeError('Invalid message structure!'));
    }
  }

  if (!Object.prototype.hasOwnProperty.call(data, 'chat_id')) {
    return Promise.reject(new TypeError('Invalid message structure!'));
  }

  if (!Object.prototype.hasOwnProperty.call(data, 'text')) {
    return Promise.reject(new TypeError('Invalid message structure!'));
  }

  if (!Object.prototype.hasOwnProperty.call(data, 'send_date')) data.send_date = Date.now();
  ctx.data = data;
  return ctx;
}

function updateChat(context) {
  context.app.service('chats')
    .patch(context.data.chat_id, { updated_at: Date.now() });
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
      updateChat,
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
