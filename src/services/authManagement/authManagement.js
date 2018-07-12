'use strict';
const authManagement = require('feathers-authentication-management');
const hooks = require('./hooks');
const notifier = require('./notifier');
const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const common = require('feathers-hooks-common');
const isAction = (...args) => hook => args.includes(hook.data.action);

module.exports = function() {
  const app = this;
// Initialize our service with any options it requires
  app.configure(authManagement(notifier(app)));
// Get our initialize service to that we can bind hooks
  const authManagementService = app.service('authManagement');
// Set up our before hooks
  authManagementService.before(hooks.before);
// Set up our after hooks
  authManagementService.after(hooks.after);
};

exports.before = {
  all: [],
  find: [],
  get: [],
  create: [
    common.iff(isAction('passwordChange', 'identityChange'),
      auth.verifyToken(),
      auth.populateUser(),
      auth.restrictToAuthenticated()
    ),
  ],
  update: [],
  patch: [],
  remove: []
};
