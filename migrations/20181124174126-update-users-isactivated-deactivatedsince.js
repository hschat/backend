module.exports = {
  up: (queryInterface, Sequelize) => { // eslint-disable-line
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return [
      queryInterface.addColumn(
        'users',
        'is_activated', {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
      ),
      queryInterface.addColumn(
        'users',
        'deactivated_since', {
          type: Sequelize.DATE,
          allowNull: true,
        },
      ),
    ];
  },

  down: (queryInterface) => { // eslint-disable-line
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return [
      queryInterface.removeColumn('users', 'is_activated'),
      queryInterface.removeColumn('users', 'deactivated_since'),
    ];
  },
};
