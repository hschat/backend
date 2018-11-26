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

describe('creating a personal chat between two users', () => {
  it('should succeed with two valid users', async () => {
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

    assert.ok(personalChat !== undefined, 'Error because it could not be created');
    assert.ok(personalChat.type === 'personal', 'Error because there is the wrong type');
  });
});

describe('Find an existing chat for the hook logical checks', () => {
  it('should find some chat(s)', async () => {
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
    const chats = await app.service('chats').find({
      query: {
        $limit: 1,
        id: group.id,
      },
    });
    assert.ok(chats.length !== 0, 'Error because nothing was found');
  });
});
