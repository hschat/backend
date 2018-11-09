const users = require('./users/users.service.js');
const messages = require('./messages/messages.service.js');
const chats = require('./chats/chats.service.js');
const feedback = require('./feedback/feedback.service.js');
const email = require('./email/email.service.js');
const typing = require('./typing/typing.service.js');

module.exports = (app) => {
  app.configure(users);
  app.configure(messages);
  app.configure(chats);
  app.configure(feedback);
  app.configure(email);
  app.configure(typing);
};
