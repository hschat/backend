const hooks = require('./typing.hooks');


module.exports = (app) => {
  app.use('/typing', {
    create(data) {
      // just return typing data - do not store them in a database!
      return Promise.resolve(data);
    },
  });

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('typing');

  service.hooks(hooks);
};
