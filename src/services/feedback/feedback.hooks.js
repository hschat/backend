const { authenticate } = require('@feathersjs/authentication').hooks;
const { restrictToRoles } = require('feathers-authentication-hooks');

function publish(context) {
  console.log('published');
  console.log('context', context.params.user);
  context.app.service('feedback').publish('created', (data) => {
    return context.app.channel('admins');
  });
}


const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    roles: ['admin', 'moderator'],
    fieldName: 'role',
    idField: 'id'
  })
];


module.exports = {
  before: {
    all: [...restrict],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [publish],
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
