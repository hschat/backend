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
  it('should succeed with valid group chat with admins creation', async () => {
    const service = app.service('chats');

    const myAdmins = [];
    myAdmins.push(faker.fake('{{random.uuid}}'));
    myAdmins.push(faker.fake('{{random.uuid}}'));

    const group = await service.create({
      type: 'group',
      description: 'test-group-with-admins',
      name: 'test-group-with-admins',
      participants: myAdmins,
      admins: myAdmins,
    });

    assert.ok(group !== undefined, 'Error group not created');
  });
});

describe('selfmanaged group chat with admins creation', () => {
  it('should succeed with valid selfmanaged group chat with admins creation', async () => {
    const service = app.service('chats');

    const myAdmins = [];
    myAdmins.push(faker.fake('{{random.uuid}}'));
    myAdmins.push(faker.fake('{{random.uuid}}'));

    const group = await service.create({
      type: 'group',
      description: 'test-group-with-admins-and-selfmanaged',
      name: 'test-group-with-admins',
      participants: myAdmins,
      admins: myAdmins,
      is_selfmanaged: true,
      selfmanaged_password: 'moodle-beitrittspasswort',
      selfmanaged_invitation_link: 'https://hschat.app/groups/join/test-group-with-admins',
    });

    assert.ok(group !== undefined, 'Error group not created');
  });
});
