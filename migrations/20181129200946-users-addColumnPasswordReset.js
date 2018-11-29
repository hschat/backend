module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn(
      'users',
      'temporary_password', {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
      },
    ),
  ]),
  down: queryInterface => Promise.all([
    queryInterface.removeColumn('users', 'temporary_password'),
  ]),
};
