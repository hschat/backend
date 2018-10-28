const { authenticate } = require('@feathersjs/authentication').hooks;
const checkpermissions = require('feathers-permissions');

const logger = require('winston');

function publish(context) {
  logger.debug('Feedback published');
  context.app
    .service('feedback')
    .publish('created', () => context.app.channel('authenticated'));
}

const restrict = [
  authenticate('jwt'),
  checkpermissions({
    roles: ['admin', 'moderator'],
    field: 'role',
  }),
];

module.exports = {
  before: {
    all: [],
    find: [...restrict],
    get: [...restrict],
    create: [authenticate('jwt')],
    update: [...restrict],
    patch: [...restrict],
    remove: [...restrict],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [publish],
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
