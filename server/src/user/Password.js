const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Model = Sequelize.Model;

class Password extends Model {}

Password.init(
  {
    userId: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize,
    modelName: "password",
  }
);

module.exports = Password;
