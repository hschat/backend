const Sequelize = require('sequelize');

module.exports = {

  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'chats',
      'name',
      {
        type: Sequelize.STRING,
      }
    )

      } ,

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('chats','name');
  }
}
