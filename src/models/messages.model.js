// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
	const sequelizeClient = app.get('sequelizeClient');
	const messages = sequelizeClient.define('messages', {
		id: {
			type: DataTypes.UUID,
			default: DataTypes.UUIDV4,
      primaryKey: true
		},
		created_at: {
			type: DataTypes.DATE,
			default: DataTypes.NOW
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		chat_id: {
			type: DataTypes.UUID,
			allowNull: false,
			default: DataTypes.UUIDV4
		},
		sender_id: {
			type: DataTypes.UUID,
			allowNull: false,
			default: DataTypes.UUIDV4
		},
		send_date: {
			type: DataTypes.DATE,
			allowNull: false,
			default: DataTypes.NOW
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
			allowNull: false
		}
	}, {
		hooks: {
			beforeCount(options) {
				options.raw = true;
			}
		}
	});

	messages.associate = function(models) { // eslint-disable-line no-unused-vars
		// Define associations here
		// See http://docs.sequelizejs.com/en/latest/docs/associations/
	};

	return messages;
};
