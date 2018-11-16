/* eslint-disable no-unused-vars */
module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('messages', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    createdAt: {
      type: DataTypes.DATE,
      default: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    chat_id: {
      type: DataTypes.UUID,
      allowNull: false,
      default: DataTypes.UUIDV4,
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false,
      default: DataTypes.UUIDV4,
    },
    send_date: {
      type: DataTypes.DATE,
      allowNull: false,
      default: DataTypes.NOW,
    },
    recieve_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    system: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }),

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};
