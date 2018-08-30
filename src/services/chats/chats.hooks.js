const { restrictToOwner } = require('feathers-authentication-hooks');
const { authenticate } = require('@feathersjs/authentication').hooks;
const hooks = require('feathers-hooks-common');
const logger = require('winston');

const restrict = [
  authenticate('jwt'),
  restrictToOwner({
    idField: 'id',
  })
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
  if (Object.prototype.hasOwnProperty.call(user, 'password')) user.password = undefined;
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
  const { participants, type } = context.data;

  logger.debug('Participants', participants);

  if (!Object.prototype.hasOwnProperty.call(context.data, 'created_at')) {
    context.data.created_at = Date.now();
  }

  console.log('da fugg', context.data);
  // If its a group chat skip checking for doubles
  if (type === 'group') return context;

  if (type !== 'personal') return undefined;

  // Only allow creation of chats where participants is an array (formal validation error)
  if (!Array.isArray(participants)) return undefined;
  // Filter for an existing chat

  return await context.app.service('chats')
    .find({
      query: {
        $or: [
          { participants },
        ],
        type: 'personal',
      },
    })
    .then(async (result) => {
      logger.debug('DB Query Result: ', result);
      result.data = result.data.filter((chat) => {
        const p = chat.participants;
        return p.length === participants.length && p.every((v, i) => v === participants[i]);
      });
      result.total = result.data.length;

      let chat;

      if (result.total === 0) return context;

      if (result.total > 1) {
        logger.error('User has too many duplicate chats!!');
        return undefined;
      }
      logger.debug('Duplicate chat found');
      context.params.is_double = true;


      await Promise.all(result.data.map(async (c) => {
        c.participants = await replaceUsers(context, c.participants);
        chat = c;
      }));

      context.result = chat;

      logger.info('Skipping service call from ', context.method, ' with ', context.result);

      // Nothing found, back to normal
      return context;
    });
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

  logger.debug('Returning after ', context.method, ' before finished formatting ', context.result);

  if (Object.prototype.hasOwnProperty.call(context.result, 'data')) {
    context.result = context.result.data;
  }

  // Checks if the object is an array to apply the formatting step on each element
  if (Array.isArray(context.result)) {
    let chats = [];

    // Execute the replacement step of users for each element
    await Promise.all(context.result.map(async chat => {
      // Replace the recievers array of the users
      chat.participants = await replaceUsers(context, chat.participants);

      chats.push(chat);
    }));

    context.result = chats;
    logger.debug('Inside format :', context.result);
  } else {
    // Check if the return value is a object and
    // has the the property `participants` apply the replacement process
    if (context.result.hasOwnProperty('participants')) {
      context.result.participants = await replaceUsers(context, context.result.participants);
    }
  }

  logger.debug('Returning after format of ', context.method, context.result);
  return context;
}

function sendSystemNotification(context) {
  if (Object.prototype.hasOwnProperty.call(context.params, 'is_double') && context.params.is_double) {
    context.params.is_double = undefined;
    return context;
  }

  let chat = context.result;

  let msg = {
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
  // ToDo: Select proper Object.x (keys, values, entries) method
  for (const i in chat.participants) {
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
        const channel = context.app.channel(context.app.channels)
          .filter(connection => {
            return (chat.participants.indexOf(connection.user.id) !== -1);
          });

        // If no channel was found return undefined
        if (channel === undefined) return undefined;

        return channel;
      });
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
    find: [],
    get: [...restrict, debug],
    create: [checkForDouble],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [
      hooks.when(
        hook => hook.params.provider,
        formatChats,
      ),
    ],
    find: [],
    get: [],
    create: [
      sendSystemNotification,
      notifyParticipants,
    ],
    update: [notifyParticipants],
    patch: [notifyParticipants],
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
