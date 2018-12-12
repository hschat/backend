const { authenticate } = require('@feathersjs/authentication').hooks;
const feathers = require('@feathersjs/feathers');
const commonHooks = require('feathers-hooks-common');
const { hashPassword } = require('@feathersjs/authentication-local').hooks;
const { restrictToOwner } = require('feathers-authentication-hooks');
//const { restrictDeactivated } = require('@feathersjs/errors');
const logger = require('winston');

const restrict = [
  authenticate('jwt'),
  (context) => { // Restricts to Admins only
    if (!context.params.user) {
      console.log('not admin');
      return undefined; // If User is not Admin, allow self update
    }
    if (context.params.user.role === 'admin') {
      console.log('success Admin');
      return feathers.SKIP;
    }
    return undefined;
  },
  restrictToOwner({
    idField: 'id',
    ownerField: 'id',
  }),
];

const restrictDeactivated = [
  authenticate('jwt'),
  (context) => {
    //if(!context.params.user){
      //return undefined;
    //}
    if (context.params.user.is_activated === true){
      console.log('Success');
      return feathers.SKIP;
    }else{
      throw new Error('User deaktiviert');
      return undefined;
    }
    return undefined;
  },
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
    create: [...restrictDeactivated, hashPassword(), setUserFields],
    update: [...restrict,...restrictDeactivated, hashPassword()],
    patch: [
      ...restrict, ...restrictDeactivated,
      hashPassword(),
    ],
    remove: [...restrict, ...restrictDeactivated],
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
