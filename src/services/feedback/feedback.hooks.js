const { authenticate } = require('@feathersjs/authentication').hooks;
const { restrictToRoles } = require('feathers-authentication-hooks');

function publish(context) {
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
    all: [],
    find: [...restrict],
    get: [...restrict],
    create: [authenticate('jwt')],
    update: [...restrict],
    patch: [...restrict],
    remove: [...restrict]
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
