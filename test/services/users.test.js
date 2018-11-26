const faker = require('faker');
const assert = require('assert');
const app = require('../../src/app');


describe('\'users\' service', () => {
  it('registered the service', () => {
    const service = app.service('users');
    assert.ok(service, 'Registered the service');
  });

  describe('user creation', () => {
    it('should succeed with valid user data', async () => {
      const service = app.service('users');

      const user = await service.create({
        prename: 'TestTest',
        lastname: faker.name.lastName(),
        email: faker.internet.email(),
        hsid: 'test1234',
        password: faker.internet.password(),
      });
      assert.ok(user !== undefined, 'Error user was not created');
      assert.ok(user.hsid === 'test1234');
    });
  });

  describe('user finding', () => {
    it('should succeed with valid user data', async () => {
      const service = app.service('users');

      const users = await service.find({
        idField: 'id',
        ownerField: 'id',
      });

      assert.ok(service);
      assert.ok(users !== undefined, 'Error at finding users from database');
    });
    it('should find something with valid data', async () => {
      const service = await app.service('users')
        .find({
          query: {
            $limit: 1,
            prename: 'TestTest',
          },
        });
      assert.ok(service.data.length === 1, 'Error accured at finding users with prename');
      assert.ok(service.data[0].hsid === 'test1234', 'Error within found users data');
    });
  });

  describe('user creation', () => {
    it('should hash the password', async () => {
      const user = await app.service('users')
        .create({
          prename: faker.name.firstName(),
          lastname: faker.name.lastName(),
          email: faker.internet.email(),
          hsid: 'test1234',
          password: 'secret',
        });

      assert.ok(user.password !== 'secret', 'Error password hashing');
      assert.ok(user.hsid === 'test1234');
      assert.ok(user.isVerified === false, 'failed verification flag');
    });
  });

  describe('user getting from database', () => {
    it('should get the right user with valid data', async () => {
      const user = await app.service('users')
        .create({
          prename: faker.name.firstName(),
          lastname: faker.name.lastName(),
          email: faker.internet.email(),
          hsid: 'test1234',
          password: 'secret',
        });

      await app.service('users')
        .patch(user.id, { prename: 'Ulfulfulf' });

      const controllUser = await app.service('users')
        .get(user.id);

      assert.ok(user.hsid === controllUser.hsid, 'Error at getting because we should have two equal objects');
      assert.ok(user.prename !== controllUser.prename, 'Error at patch because there was no change');
    });
  });
});
