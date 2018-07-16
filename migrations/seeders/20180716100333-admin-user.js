'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('users', [{
        id: '883a5036-00b5-48b9-88f1-2d6d41387d42',
        prename: 'Admin',
        lastname: 'User',
        email: 'admin@hschat.app',
        password: '$2a$12$iUNtSmr4TY/n/HJFgrl8EuwJPqIIcQyK42nkmmO6u.A.Xj2oif4E2',
        role: 'admin',
        hsid: 'admin',
        createdAt: '2018-05-04 12:34:03.692+02',
        updatedAt: '2018-05-04 12:34:03.692+02'
      }], {});
  }

};
