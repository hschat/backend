// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');

const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
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
      type: DataTypes.STRING
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
