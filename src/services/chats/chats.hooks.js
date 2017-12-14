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
 * Helper function that replaces the reciever ids with its user object.
 * Used for formatting chat objects after searching them.
 * @param context The context of the request
 * @param recievers The list of the recievers that should get replaced
 * @returns {Promise<*>} Returns a promise of the function progress
 */
async function replaceUsers(context, recievers) {
  if (!Array.isArray(recievers)) return undefined;
  for (let v in recievers) {
    // Replace the uuid of the user only when its a string ID, otherwise DB calls will fail
    // becaus of complex objects
    if (typeof  recievers[v] === 'string') {
      recievers[v] = await replaceUser(context, recievers[v]);
    }
  }
  return recievers;
}

/**
 * Hook function for checking if a chat already exists before creating one.
 * Returns early if the chats exists by skipping the service call.
 * @param context The context of the request
 * @returns {Promise<*>} Returns a promise of the function progress
 */
async function check_for_double(context) {
  let owner = context.data.owner;
  let recievers = context.data.recievers;

  // Only single person chats may be unique
  if (recievers.length === 1) {
    return context.app.service('chats').find({
      query: {
        owner: owner
      }
      // Chats were found
    }).then(async (result) => {
      let chats = result.data;
      console.log('DB Query Result: ', chats);
      for (let i in chats) {
        if (chats[i].recievers[0] === recievers[0]) {
          console.error('Duplicate chat found');
          chats[i].recievers = await replaceUsers(context, chats[i].recievers);
          context.result = chats[i];
          return context;
        }
      }
      // Nothing found, back to normal
      return context;
    });
  }
  // No identical chats were found
  return context;
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

  if (context.result.hasOwnProperty('data')) {
    context.result = context.result.data;
  }

  // Checks if the object is an array to apply the formatting step on each element
  if (Array.isArray(context.result)) {
    let chats = context.result;

    // Execute the replacement step of users for each element
    for (let i in chats) {
      // Replace the recievers array of the users
      chats[i].recievers = await replaceUsers(context, chats[i].recievers);
    }

    context.result = chats;
  } else {
    // Check if the return value is a object and has the the property `recievers` apply the replacement process
    if (context.result.hasOwnProperty('recievers')) {
      context.result.recievers = await replaceUsers(context, context.result.recievers);
    }
  }

  console.log('Format after ', context.method, context.result);
  return context;
}

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [...restrict],
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
