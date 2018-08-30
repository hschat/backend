// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');

const { DataTypes } = Sequelize;

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient');
  const messages = sequelizeClient.define('messages', {
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
  }, {
    hooks: {
      beforeCount(options) {
        // eslint-disable-next-line no-param-reassign
        options.raw = true;
      },
    },
  });

  // eslint-disable-next-line no-unused-vars
  messages.associate = (models) => {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return messages;
};
