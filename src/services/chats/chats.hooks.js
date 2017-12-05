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
      for(let i in result) {
        if(result[i].recievers[0].id === recievers[0]) {
          console.info('Duplicate chat found');
          context.result = result;
          return context;}
      }
      // Nothing found, back to normal
      return context;
    })
  }
  // No identical chats were found
  return Promise.resolve(undefined);
}


async function format_chats(context) {
  context.result = context.result.data;

  let chats = context.result;

  for(let i in chats) {
    /*
    chats[i].owner = await context.app.service('users').get(chats[i].owner);
    if (chats[i].owner.hasOwnProperty('password')) chats[i].owner.password = undefined;
    */
    //chats[i].owner = undefined;

    for(let v in chats[i].recievers) {
      chats[i].recievers[v] = await context.app.service('users').get(chats[i].recievers[v]);
      if (chats[i].recievers[v].hasOwnProperty('password')) chats[i].recievers[v].password = undefined;
    }
  }

  context.result = chats;

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
    all: [],
    find: [format_chats],
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
