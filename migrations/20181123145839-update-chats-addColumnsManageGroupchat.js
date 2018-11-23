module.exports = {
  up: (queryInterface, DataTypes) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.addColumn(
      'chats',
      'group_admins',
      {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: true,
      },
    );
    queryInterface.addColumn(
      'chats',
      'group_description',
      {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    );
    queryInterface.addColumn(
      'chats',
      'group_is_selfmanaged',
      {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    );
    queryInterface.addColumn(
      'chats',
      'group_selfmanaged_password',
      {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    );
    queryInterface.addColumn(
      'chats',
      'group_selfmanaged_invitation_link',
      {
        type: DataTypes.TEXT,
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
    queryInterface.removeColumn('chats', 'group_admins');
    queryInterface.removeColumn('chats', 'group_description');
    queryInterface.removeColumn('chats', 'group_is_selfmanaged');
    queryInterface.removeColumn('chats', 'group_selfmanaged_password');
    queryInterface.removeColumn('chats', 'group_selfmanaged_invitation_link');
  },
};
