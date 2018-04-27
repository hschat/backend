// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
	const sequelizeClient = app.get('sequelizeClient');
	const users = sequelizeClient.define('users', {
		id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
		},
		createdAt: {
			type: DataTypes.DATE,
			default: DataTypes.NOW
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		hsid: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		prename: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lastname: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		status: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		meter_to_hs: {
			type: DataTypes.FLOAT,
			allowNull: true,
		},
		location_in_hs: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
		location_check_time: {
			type: DataTypes.DATE,
			allowNull: true,
		}
	}, {
		hooks: {
			beforeCount(options) {
				options.raw = true;
			}
		}
	});

	users.associate = function(models) { // eslint-disable-line no-unused-vars
		// Define associations here
		// See http://docs.sequelizejs.com/en/latest/docs/associations/
	};

	return users;
};
