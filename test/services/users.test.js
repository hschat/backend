const faker = require('faker');
const assert = require('assert');
const app = require('../../src/app');

describe('\'users\' service', () => {
  it('registered the service', () => {
    const service = app.service('users');
    assert.ok(service, 'Registered the service');
  });

  describe('user creation', () => {
    it('should succeed with valid user data', () => {
      const service = app.service('users');

      const fName = faker.name.firstName();
      const lName = faker.name.lastName();
      const hsid

      service.create({
        prename: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: faker.internet.email(),
      });

      //console.log(service);
      assert.ok(true, false);
    });

    it('should fail with invalid user data', () => {

    });
  });

});
