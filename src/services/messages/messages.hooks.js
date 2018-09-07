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
  if (Object.prototype.hasOwnProperty.call(user, 'password')) {
    user.password = undefined;
  }
  return user;
}

/**
 *
 * @param context
 * @returns {Promise<*>}
 */
async function resolveUsers(context) {
  const ctx = context;

  if ({}.hasOwnProperty.call(ctx.result, 'data')) {
    ctx.result = ctx.result.data;
  }

  if (Array.isArray(ctx.result)) {
    for (const i in Object.keys(ctx.result)) {
      if ({}.hasOwnProperty.call(ctx.result[i], 'sender_id')) {
        // ToDo: Improve execution speed by parallelization (no-await-in-loop)
        ctx.result[i].sender = await replaceUser(
          ctx,
          ctx.result[i].sender_id
        );
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

  if (!Object.prototype.hasOwnProperty.call(data, 'send_date')) {
    data.send_date = Date.now();
  }
  ctx.data = data;
  return ctx;
}

async function updateChat(context) {
  context.app
    .service('chats')
    .patch(context.data.chat_id, { updated_at: Date.now() });

  // ToDo: Move into separate function
  context.result.sender = await replaceUser(
    context,
    context.result.sender_id
  );
  context.result.sender_id = undefined;
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
    create: [updateChat],
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
