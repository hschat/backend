module.exports = {
  up: (queryInterface, DataTypes) => { // eslint-disable-line
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return [
      queryInterface.addColumn(
        'users',
        'last_time_online',
        {
          type: DataTypes.DATE,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'users',
        'isOnline',
        {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
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
      queryInterface.removeColumn('users', 'last_time_online'),
      queryInterface.removeColumn('users', 'isOnline'),
    ];
  },
};
