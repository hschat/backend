// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const chats = sequelizeClient.define('chats', {
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      default: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      default: DataTypes.UUIDV4,
      primaryKey: true
    },
    participants: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  chats.associate = function (models) { // eslint-disable-line no-unused-vars
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return chats;
};

/*
{
  "id": "94c32f42-a6d7-4a56-bdf4-bfc49d057bc4",
}
*/
