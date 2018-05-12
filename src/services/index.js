const users = require('./users/users.service.js');
const messages = require('./messages/messages.service.js');
const chats = require('./chats/chats.service.js');
const feedback = require('./feedback/feedback.service.js');
<<<<<<< master
const email = require('./email/email.service.js');
=======
>>>>>>> [ADD] restriction to admin and moderator
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(users);
  app.configure(messages);
  app.configure(chats);
  app.configure(feedback);
<<<<<<< master
  app.configure(email);
=======
>>>>>>> [ADD] restriction to admin and moderator
};
