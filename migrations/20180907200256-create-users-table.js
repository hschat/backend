/* eslint-disable no-unused-vars */
module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('users', {
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
    location_is_allowed: {
      type: DataTypes.BOOLEAN,
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
