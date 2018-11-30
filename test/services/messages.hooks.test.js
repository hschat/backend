const app = require('../../src/app');

describe('\'messages\' hooks should fail', async () => {
  it('because of missing properties', async () => {
    const service = app.service('messages');
    service.create({}).should.be.rejectedWith(TypeError);
  });
  it('because of missing chat_id', async () => {
    const service = app.service('messages');
    const properties = {
      system: true,
      sender_id: 123,
    };
    service.create(properties).should.be.rejectedWith(TypeError);
  });
  it('because of missing text', async () => {
    const service = app.service('messages');
    const properties = {
      system: true,
      sender_id: 123,
      chat_id: 123,
    };
    service.create(properties).should.be.rejectedWith(TypeError);
  });
  it('because of missing send_date', async () => {
    const service = app.service('messages');
    const properties = {
      system: true,
      sender_id: 123,
      chat_id: 123,
      text: '123',
    };
    service.create(properties).should.be.rejectedWith(TypeError);
  });
});
