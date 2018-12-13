const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');
const { Forbidden } = require('@feathersjs/errors');

module.exports = (app) => {
  const config = app.get('authentication');

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt());
  app.configure(local(config.localhsid));
  app.configure(local());

  /*
   * Removed since no purpose or usage is visible
   * Related commit: 6e07afc
  sendVerificationEmail = options => (hook) => {
    if (!hook.params.provider) { return hook; }
    const user = hook.result;
    if (process.env.GMAIL && hook.data && hook.data.email && user) {
      accountService(hook.app).notifier('resendVerifySignup', user);
      return hook;
    }
    return hook;
  };
  */
  const restrictDeactivated = (context) => {
    if (context.params.user.is_activated === true) {
      return context;
    }
    throw new Forbidden('User deaktiviert');
  };
  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [authentication.hooks.authenticate(config.strategies), restrictDeactivated],
      remove: [authentication.hooks.authenticate('jwt')],
    },
  });
};
