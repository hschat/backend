module.exports = {
  up: (queryInterface, Sequelize) => { // eslint-disable-line
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.addColumn(
      'users',
      'location_is_allowed', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
    );
  },

  down: (queryInterface) => { // eslint-disable-line
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.removeColumn('users', 'location_is_allowed');
  },
};
