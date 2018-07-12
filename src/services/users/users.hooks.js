const accountService = require('../../services/authManagement/notifier');
const { authenticate } = require('@feathersjs/authentication').hooks;
const commonHooks = require('feathers-hooks-common');
const { restrictToOwner } = require('feathers-authentication-hooks');
const verifyHooks = require('feathers-authentication-management').hooks;


const { hashPassword } = require('@feathersjs/authentication-local').hooks;
const restrict = [
  authenticate('jwt'),
  restrictToOwner({
    idField: 'id',
    ownerField: 'id'
  })
];

function setUserFields(context) {
  context.data.isVerified = false;
  context.data.verifyToken = 'false'
  context.data.resetToken = 'false'
  return context;
}


function sendverificationEmail(context) {
  let email = {
    from: 'no-reply@hschat.app',
     to: context.data.email,
     subject: 'Mail test',
     html: 'This is the email body'
  }

  context.app.service('email').create(email).then((result) => {
    console.log(`Sent email to ${email.to}!`);
  }).catch(err => {
    console.log(err);
  });
  
  return context;
}



module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ authenticate('jwt') ],
    create: [ hashPassword(), setUserFields/*verifyHooks.addVerification() */],
    update: [ ...restrict, hashPassword(), commonHooks.disallow('external') ],
    patch: [ ...restrict, hashPassword(), commonHooks.iff(
  commonHooks.isProvider('external'),
  commonHooks.preventChanges(
    'email',
    'isVerified',
    'verifyToken',
    'verifyShortToken',
    'verifyExpires',
    'verifyChanges',
    'resetToken',
    'resetShortToken',
    'resetExpires'
  )) ],
    remove: [ ...restrict ]
  },

  after: {
    all: [
      commonHooks.when(
        hook => hook.params.provider,
        commonHooks.discard('password')
      )
    ],
    find: [],
    get: [],
    create: [sendverificationEmail],
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
