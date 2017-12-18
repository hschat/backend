const {restrictToOwner} = require('feathers-authentication-hooks');
const {authenticate} = require('@feathersjs/authentication').hooks;
const hooks = require('feathers-hooks-common');

const restrict = [
  authenticate('jwt'),
  restrictToOwner({
    idField: 'id',
    ownerField: 'owner'
  })
];

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
 * Helper function that replaces the participant ids with its user object.
 * Used for formatting chat objects after searching them.
 * @param context The context of the request
 * @param participants The list of the participants that should get replaced
 * @returns {Promise<*>} Returns a promise of the function progress
 */
async function replaceUsers(context, participants) {
  if (!Array.isArray(participants)) return undefined;
  for (let v in participants) {
    // Replace the uuid of the user only when its a string ID, otherwise DB calls will fail
    // becaus of complex objects
    if (typeof  participants[v] === 'string') {
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
async function check_for_double(context) {
  let participants = context.data.participants;
  let type = context.data.type;

  // If its a group chat skip checking for doubles
  if (type === 'group') return context;

  if (type !== 'personal') return undefined;

  // Only allow creation of chats where participants is an array (formal validation error)
  if (!Array.isArray(participants)) return undefined;

  // Filter for an existing chat
  return await context.app.service('chats').find({
    query: {
      participants: participants
    }
  }).then(async (result) => {
    let chats = [];
    console.debug('DB Query Result: ', result);

    if (result.total === 0) return context;

    if (result.total > 1) {
      console.error('User has too many duplicate chats!!');
      return undefined;
    }

    console.log('Duplicate chat found');

    await Promise.all(result.data.map(async chat => {
      chat.participants = await replaceUsers(context, chat.participants);
      chats.push(chat);
    }));

    context.result = chats;

    console.debug('Skipping service call from ', context.method, ' with ', context.result);

    // Nothing found, back to normal
    return context;

  });
}


/**
 * Formatting a chat object before sending to the client
 * @param context The context of the request
 * @returns {Promise<*>} Returns a promise of the function progress
 */
async function format_chats(context) {
  /* Example structure from the database
   * { total: 1,
   *   data: [{
   *    id: '3c31230b-ed81-4f59-b0ba-5d4667a6995a',
   *    owner: '231c6fbb-93fb-4ab1-a933-e212bd44ba1b',
   *    recievers: [Array]
   *   }],
   *  limit: 10,
   *  skip: 0
   * }
   */

  console.debug('Returning after ', context.method, ' before finished formatting ', context.result);

  if (context.result.hasOwnProperty('data')) {
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
    console.log('Inside format :', context.result);
  } else {
    // Check if the return value is a object and has the the property `recievers` apply the replacement process
    if (context.result.hasOwnProperty('recievers')) {
      context.result.recievers = await replaceUsers(context, context.result.recievers);
    }
  }

  console.debug('Returning after format of ', context.method, context.result);
  return context;
}

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [...restrict],
    create: [check_for_double],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [
      hooks.when(
        hook => hook.params.provider,
        format_chats
      )
    ],
    find: [],
    get: [],
    create: [],
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
