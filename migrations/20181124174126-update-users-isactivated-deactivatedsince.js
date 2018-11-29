module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
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
  ]),
  down: queryInterface => Promise.all([
    queryInterface.removeColumn('users', 'is_activated'),
    queryInterface.removeColumn('users', 'deactivated_since'),
  ]),
};
