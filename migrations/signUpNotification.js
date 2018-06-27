const Sequelize = require('sequelize');

module.exports = {

  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'users',
      'isVerified',
      {
          type: Sequelize.BOOLEAN,
      }
    ),

    queryInterface.addColumn(
      'users',
      'verifyToken',
      {
        type: Sequelize.STRING,
      }
    ),

    queryInterface.addColumn(
      'users',
      'verifyExpires',
      {
        type: Sequelize.DATE,
      }
    ),

    queryInterface.addColumn(
      'users',
      'verifyChanges',
      {
        type: Sequelize.OBJECT,
      }
    ),

    queryInterface.addColumn(
      'users',
      'resetToken',
      {
        type: Sequelize.STRING,
      }
    ),

    queryInterface.addColumn(
      'users',
      '  resetExpires',
      {
        type: Sequelize.DATE,
      }
    )

      } ,

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users','isVerified'),
           queryInterface.removeColumn('users','verifyToken'),
           queryInterface.removeColumn('users','verifyExpires'),
           queryInterface.removeColumn('users','verifyChanges'),
           queryInterface.removeColumn('users','resetToken')
           queryInterface.removeColumn('users','resetExpires');
  }
}
