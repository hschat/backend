module.exports = {
  up: (queryInterface) => {
    queryInterface.removeColumn('users', 'is_activated');
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    queryInterface.addColumn(
      'users',
      'is_activated', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
    );
  },
};
