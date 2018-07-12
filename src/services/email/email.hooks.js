const commonHooks = require('feathers-hooks-common');

module.exports.before = {
  all: [
    commonHooks.disable('external')
  ],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
