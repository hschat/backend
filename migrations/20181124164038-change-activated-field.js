module.exports = {
  up: queryInterface => queryInterface.removeColumn('users', 'is_activated'),

  down: (queryInterface, Sequelize) => queryInterface.addColumn(
    'users',
    'is_activated', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
  ),
};
