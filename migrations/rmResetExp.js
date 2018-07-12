const Sequelize = require('sequelize');


module.exports = {

  up:(queryInterface, Sequelize) => {

    queryInterface.removeColumn('users','  resetExpires');

  }

}
