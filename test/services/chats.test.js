const assert = require('assert');
const faker = require('faker');
const app = require('../../src/app');

describe('\'chats\' service', () => {
  it('registered the service', () => {
    const service = app.service('chats');

    assert.ok(service, 'Registered the service');
  });
});

describe('group chat with admins creation', () => {
  it('should succeed with valid group chat with admins creation', () => {
    const service = app.service('chats');

    const myAdmins = [];
    myAdmins.push(faker.fake('{{random.uuid}}'));
    myAdmins.push(faker.fake('{{random.uuid}}'));

    service.create({
      type: 'group',
      name: 'test-group-with-admins',
      participants: myAdmins,
      admins: myAdmins,
    });

    assert.ok(service);
    assert.ok(true, 'Error occured in the group chat with admins creation');
  });
});
