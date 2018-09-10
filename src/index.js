/* eslint-disable no-console */
const logger = require('winston');
const app = require('./app');

const port = app.get('port');
const server = app.listen(port);

process.on('unhandledRejection', (reason, p) => {
  if ({}.hasOwnProperty.call(process.env, 'SENTRY_DSN')) {
    // eslint-disable-next-line global-require
    const Raven = require('raven');
    Raven.captureException(reason);
  }

  logger.error('Unhandled Rejection at: Promise ', p, reason);
});

server.on('listening', () => logger.info(
  'Feathers application started on http://%s:%d',
  app.get('host'),
  port,
));
