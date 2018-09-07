'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'chats',
      'participants',
      {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      }
    );
  },
  down: (queryInterface, Sequelize) => {


  }
};
