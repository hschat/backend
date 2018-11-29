module.exports = {
  up: (queryInterface) => { // eslint-disable-line
    return queryInterface.removeColumn('users', 'is_activated');
  },

  down: (queryInterface, Sequelize) => { // eslint-disable-line
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.addColumn(
      'users',
      'is_activated', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
    );
  },
};
