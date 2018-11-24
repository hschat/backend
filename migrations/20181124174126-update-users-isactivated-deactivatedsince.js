module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.addColumn(
      'users',
      'is_activated', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    );

    queryInterface.addColumn(
      'users',
      'deactivated_since', {
        type: Sequelize.DATE,
        allowNull: true,
      },
    );
  },

  down: (queryInterface) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    queryInterface.removeColumn('users', 'is_activated');
    queryInterface.removeColumn('users', 'deactivated_since');
  },
};
