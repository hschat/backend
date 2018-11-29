module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'users',
    'location_is_allowed', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
  ),
  down: queryInterface => queryInterface.removeColumn('users', 'location_is_allowed'),
};
