const assert = require('assert');
const faker = require('faker');
const app = require('../../src/app');

describe('\'messages\' service', () => {
  it('registered the service', () => {
    const service = app.service('messages');

    assert.ok(service, 'Registered the service');
  });
});
describe('messages service create and find', () => {
  it('create a new message', async () => {
    const helpUser = await app.service('users').create({
      prename: 'TestTest',
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
      hsid: 'test1234',
      password: faker.internet.password(),
    });

    const helpUserTwo = await app.service('users').create({
      prename: 'TestTest2',
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
      hsid: 'test1234',
      password: faker.internet.password(),
    });

    const participantList = [];
    participantList.push(helpUser.id);
    participantList.push(helpUserTwo.id);

    const personalChat = await app.service('chats').create({
      type: 'personal',
      participants: participantList,
    });

    const service = app.service('messages');

    const message = await service.create({
      createdAt: Date.now(),
      updatedAt: Date.now(),
      chat_id: personalChat.id,
      sender_id: helpUser.id,
      send_date: Date.now(),
      recieve_date: Date.now(),
      system: true,
      text: 'This is a test',
    });

    const foundMessages = await app.service('messages').find({
      query: {
        $limit: 1,
        text: 'This is a test',
      },
    });
    assert.ok(message !== undefined, 'Error at creating a new message');
    assert.ok(message.text === 'This is a test');
    assert.ok(foundMessages.length !== 0);
  });
});
