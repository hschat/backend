// Initializes the `feedback` service on path `/feedback`
const createService = require('feathers-sequelize');
const createModel = require('../../models/feedback.model');
const hooks = require('./feedback.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'feedback',
    Model,
    paginate,
  };

  // Initialize our service with any options it requires
  app.use('/feedback', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('feedback');

  service.hooks(hooks);
};
