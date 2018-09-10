const { authenticate } = require('@feathersjs/authentication').hooks;
const commonHooks = require('feathers-hooks-common');
const { restrictToOwner } = require('feathers-authentication-hooks');

const { hashPassword } = require('@feathersjs/authentication-local').hooks;

const logger = require('winston');

const restrict = [
  authenticate('jwt'),
  restrictToOwner({
    idField: 'id',
    ownerField: 'id',
  }),
];

function setUserFields(context) {
  const c = context;
  c.data.isVerified = false;
  c.data.verifyToken = 'false';
  c.data.resetToken = 'false';
  return c;
}

function sendVerificationEmail(context) {
  const email = {
    from: 'no-reply@hschat.app',
    to: context.data.email,
    subject: 'Mail test',
    html: 'This is the email body',
  };

  context.app
    .service('email')
    .create(email)
    .then(() => {
      logger.info(`Sent email to ${email.to}!`);
    })
    .catch((err) => {
      logger.error(err);
    });

  return context;
}

module.exports = {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [hashPassword(), setUserFields],
    update: [...restrict, hashPassword(), commonHooks.disallow('external')],
    patch: [
      ...restrict,
      hashPassword(),
      commonHooks.iff(
        commonHooks.isProvider('external'),
        commonHooks.preventChanges(
          true,
          'email',
          'isVerified',
          'verifyToken',
          'verifyShortToken',
          'verifyExpires',
          'verifyChanges',
          'resetToken',
          'resetShortToken',
          'resetExpires',
        ),
      ),
    ],
    remove: [...restrict],
  },

  after: {
    all: [
      commonHooks.when(
        hook => hook.params.provider,
        commonHooks.discard('password'),
      ),
    ],
    find: [],
    get: [],
    create: [sendVerificationEmail],
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
