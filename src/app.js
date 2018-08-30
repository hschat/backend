const logger = require('winston');

if (Object.prototype.hasOwnProperty.call(process.env, 'SENTRY_DSN')) {
  // eslint-disable-next-line global-require
  const Raven = require('raven');
  Raven.config(process.env.SENTRY_DSN).install();
  logger.info('Sentry enabled');
}

const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');

const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const configuration = require('@feathersjs/configuration');
const socketio = require('@feathersjs/socketio');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');

const authentication = require('./authentication');

const sequelize = require('./sequelize');

const app = express(feathers());

// Load app configuration
app.configure(configuration());

// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

app.set('logger', logger);

app.use(helmet());
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'img', 'favicon', 'favicon.ico')));

app.use('/', express.static(app.get('public')));

app.configure(sequelize);
app.configure(express.rest());
app.configure(socketio());

app.configure(middleware);
app.configure(authentication);

app.configure(services);
app.configure(channels);

app.use(express.notFound());
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);

module.exports = app;
