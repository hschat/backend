const mailer = require('feathers-mailer');
const hooks = require('./email.hooks');

module.exports = (app) => {
  const options = {
    port: 587,
    host: 'in-v3.mailjet.com',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };

  // Initialize our service with any options it requires
  app.use('/email', mailer(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('email');

  service.hooks(hooks);
};
