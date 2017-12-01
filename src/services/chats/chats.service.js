// Initializes the `chats` service on path `/chats`
const createService = require('feathers-rethinkdb');
const hooks = require('./chats.hooks');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'chats',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/chats', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('chats');

  service.hooks(hooks);
};
