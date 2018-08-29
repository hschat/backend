const commonHooks = require('feathers-hooks-common');

module.exports.before = {
  all: [
    commonHooks.disallow('external'),
  ],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
