module.exports = {
  up: (queryInterface, DataTypes) => { // eslint-disable-line
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return Promise.all([
      queryInterface.addColumn(
        'chats',
        'admins',
        {
          type: DataTypes.ARRAY(DataTypes.UUID),
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'chats',
        'description',
        {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'chats',
        'is_selfmanaged',
        {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      ),
      queryInterface.addColumn(
        'chats',
        'selfmanaged_password',
        {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'chats',
        'selfmanaged_invitation_link',
        {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      ),
    ]);
  },
  down: (queryInterface) => { // eslint-disable-line
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
      return queryInterface.dropTable('users');
    */
    return Promise.all([
      queryInterface.removeColumn('chats', 'admins'),
      queryInterface.removeColumn('chats', 'description'),
      queryInterface.removeColumn('chats', 'is_selfmanaged'),
      queryInterface.removeColumn('chats', 'selfmanaged_password'),
      queryInterface.removeColumn('chats', 'selfmanaged_invitation_link'),
    ]);
  },
};
