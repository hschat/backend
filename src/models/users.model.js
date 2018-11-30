// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');

const { DataTypes } = Sequelize;

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient');
  const users = sequelizeClient.define(
    'users',
    {
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      hsid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
      },
      role: {
        type: DataTypes.STRING,
        default: 'default',
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      verifyToken: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      verifyExpires: {
        type: DataTypes.DATE,
      },
      resetToken: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_time_online: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isOnline: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      location_is_allowed: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      is_activated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      deactivated_since: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      temporary_password: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      hooks: {
        beforeCount(options) {
          // eslint-disable-next-line no-param-reassign
          options.raw = true;
        },
      },
    },
  );

  // eslint-disable-next-line no-unused-vars
  users.associate = (models) => {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return users;
};
