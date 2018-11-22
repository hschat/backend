const { authenticate } = require('@feathersjs/authentication').hooks;
const commonHooks = require('feathers-hooks-common');
const { hashPassword } = require('@feathersjs/authentication-local').hooks;
const logger = require('winston');

const restrict = [
  authenticate('jwt'),
  (context) => { // Restricts to Admins only
    if (context.params.user.role === 'admin') {
      return undefined;
    }
    throw new Error('Only Admin Users are allowed to do this');
  },
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
    update: [...restrict, hashPassword()],
    patch: [
      ...restrict,
      hashPassword(),
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
