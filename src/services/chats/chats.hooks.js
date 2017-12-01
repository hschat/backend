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


async function check_for_double (context) {
  let owner = context.data.owner;
  let recievers = context.data.recievers;

  // Only single person chats may be unique
  if(recievers.length === 1) {
    return context.app.service('chats').find({
      query: {
        owner: owner
      }
      // Chat was found
    }).then((result) => {
      //console.log('Found that:', result);
      for(let i in result.data) {
        if(result.data[i].recievers[0] === recievers[0]) {
          console.info('Duplicate chat found');
          context.result = result;
          return context;
        }
      }
      // Nothing found, back to normal
      return context;
    })
  }
  // No identical chats were found
  return Promise.resolve(undefined);
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
    all: [],
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
