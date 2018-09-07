const { restrictToOwner } = require('feathers-authentication-hooks');
const { authenticate } = require('@feathersjs/authentication').hooks;
const hooks = require('feathers-hooks-common');
const logger = require('winston');
const errors = require('@feathersjs/errors');

async function restrictParticipant(context) {
  const { user } = context.params;

  context.result = context.result.data;

  console.log('----------\n',context);
  console.log('----------\n',context.params);
  console.log('----------\n',context.result);

  if (user === undefined) return context; //throw new errors.Forbidden('You do not have permission to access this.');

  console.log(context.result);

  return context;
}


const restrict = [
  authenticate('jwt'),
  restrictToOwner({
    idField: 'id',
  }),
  // :TODO https://github.com/feathersjs-ecosystem/feathers-authentication-hooks#queryWithCurrentUser
  //(context) => {context.params.user_obj = context.params.user; return context;},
];

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
 * Helper function that replaces the participant ids with its user object.
 * Used for formatting chat objects after searching them.
 * @param context The context of the request
 * @param participants The list of the participants that should get replaced
 * @returns {Promise<*>} Returns a promise of the function progress
 */
async function replaceUsers(context, participants) {
  if (!Array.isArray(participants)) return undefined;
  for (const v in participants) {
    // Replace the uuid of the user only when its a string ID, otherwise DB calls will fail
    // becaus of complex objects
    if (typeof participants[v] === 'string') {
      // eslint-disable-next-line no-param-reassign
      participants[v] = await replaceUser(context, participants[v]);
    }
  }
  return participants;
}

/**
 * Hook function for checking if a chat already exists before creating one.
 * Returns early if the chats exists by skipping the service call.
 * @param context The context of the request
 * @returns {Promise<*>} Returns a promise of the function progress
 */
async function checkForDouble(context) {
  const ctx = context;
  const { participants, type } = ctx.data;

  logger.debug('Participants', participants);

  if (!Object.prototype.hasOwnProperty.call(ctx.data, 'created_at')) {
    ctx.data.created_at = Date.now();
  }

  // If its a group chat skip checking for doubles
  if (type === 'group') return ctx;

  if (type !== 'personal') return undefined;

  // Only allow creation of chats where participants is an array (formal validation error)
  if (!Array.isArray(participants)) return undefined;
  // Filter for an existing chat

  return Promise.resolve(
    ctx.app
      .service('chats')
      .find({
        query: {
          $or: [{ participants }],
          type: 'personal',
        },
      })
      .then(async result => {
        logger.debug('DB Query Result: ', result);

        // eslint-disable-next-line no-param-reassign
        result.data = result.data.filter(chat => {
          const p = chat.participants;
          return (
            p.length === participants.length &&
            p.every((v, i) => v === participants[i])
          );
        });

        // eslint-disable-next-line no-param-reassign
        result.total = result.data.length;

        let chat;

        if (result.total === 0) return ctx;

        if (result.total > 1) {
          logger.error('User has too many duplicate chats!!');
          return undefined;
        }
        logger.debug('Duplicate chat found');
        ctx.params.is_double = true;

        await Promise.all(
          result.data.map(async c => {
            // eslint-disable-next-line no-param-reassign
            c.participants = await replaceUsers(ctx, c.participants);
            chat = c;
          })
        );

        ctx.result = chat;

        logger.info(
          'Skipping service call from ',
          ctx.method,
          ' with ',
          ctx.result
        );

        // Nothing found, back to normal
        return ctx;
      })
  );
}

/**
 * Formatting a chat object before sending to the client
 * @param context The context of the request
 * @returns {Promise<*>} Returns a promise of the function progress
 */
async function formatChats(context) {
  /* Example structure from the database
   * { total: 1,
   *   data: [{
   *    id: '3c31230b-ed81-4f59-b0ba-5d4667a6995a',
   *    name: 'David ist dumm',
   *    type: 'group' | 'personal'
   *    participants: [Array]
   *   }],
   *  limit: 10,
   *  skip: 0
   * }
   */
  const ctx = context;

  logger.debug(
    'Returning after ',
    ctx.method,
    ' before finished formatting ',
    ctx.result
  );

  if ({}.hasOwnProperty.call(ctx.result, 'data')) {
    ctx.result = ctx.result.data;
  }

  // Checks if the object is an array to apply the formatting step on each element
  if (Array.isArray(ctx.result)) {
    const chats = [];

    // Execute the replacement step of users for each element
    await Promise.all(
      ctx.result.map(async chat => {
        const c = chat;
        // Replace the recievers array of the users
        c.participants = await replaceUsers(ctx, chat.participants);

        chats.push(c);
      })
    );

    ctx.result = chats;
    logger.debug('Inside format :', ctx.result);
  }

  // Check if the return value is a object and
  // has the the property `participants` apply the replacement process
  if ({}.hasOwnProperty.call(ctx.result, 'participants')) {
    ctx.result.participants = await replaceUsers(ctx, ctx.result.participants);
  }

  logger.debug('Returning after format of ', ctx.method, ctx.result);
  return ctx;
}

// ToDo: Evaluate the necessity of the function below
// eslint-disable-next-line no-unused-vars
function sendSystemNotification(context) {
  if (
    Object.prototype.hasOwnProperty.call(context.params, 'is_double') &&
    context.params.is_double
  ) {
    // eslint-disable-next-line no-param-reassign
    context.params.is_double = undefined;
    return context;
  }

  const chat = context.result;

  const msg = {
    text: 'Der Chat wurde erstellt!',
    sender_id: -1,
    chat_id: chat.id,
    send_date: Date.now(),
    recieve_date: undefined,
    read_date: undefined,
    system: true,
  };

  context.app.service('messages')
    .create(msg);
  return context;
}

async function notifyParticipants(context) {
  const chat = context.result;

  if (!Object.prototype.hasOwnProperty.call(chat, 'participants')) {
    return Promise.reject(new TypeError('Invalid message structure!'));
  }

  // Publish foreach reciever
  // eslint-disable-next-line no-unused-vars
  for (const i in Object.keys(chat.participants)) {
    if ({}.hasOwnProperty.call(context, 'method')) {
      let m = context.method;

      if (m === 'create' || m === 'update') {
        m = `${m}d`;
      } else {
        m = `${m}ed`;
      }

      // Emit event with data
      await context.app.service('chats')
        .publish(m, async () => {
          // Search channels for given participant
          const channel = context.app
            .channel(context.app.channels)
            .filter(
              connection => chat.participants.indexOf(connection.user.id) !== -1
            );

          // If no channel was found return undefined
          if (channel === undefined) return undefined;

          return channel;
        });
    }
  }
  return context;
}

function debug(context) {
  if (process.env.NODE_ENV !== 'production') {
    logger.log(context.data, context.params);
  }
}

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [...restrict],
    get: [...restrict, debug],
    create: [
      checkForDouble
    ],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [hooks.when(hook => hook.params.provider, formatChats)],
    find: [
      //restrictParticipant,
    ],
    get: [
      //restrictParticipant,
    ],
    create: [
      // sendSystemNotification,
      //notifyParticipants,
    ],
    update: [
      //notifyParticipants
    ],
    patch: [
      //notifyParticipants
    ],
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
