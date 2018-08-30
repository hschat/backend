// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');

const { DataTypes } = Sequelize;

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient');
  const chats = sequelizeClient.define('chats', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    createdAt: {
      type: DataTypes.DATE,
      default: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    participants: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
    },
  }, {
    hooks: {
      beforeCount(options) {
        // eslint-disable-next-line no-param-reassign
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  chats.associate = (models) => {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return chats;
};
