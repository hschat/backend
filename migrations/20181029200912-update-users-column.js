module.exports = {
  up: (queryInterface, DataTypes) => Promise.all([
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
  ]),

  down: queryInterface => Promise.all([
    queryInterface.removeColumn('users', 'last_time_online'),
    queryInterface.removeColumn('users', 'isOnline'),
  ]),
};
