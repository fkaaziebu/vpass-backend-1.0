const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const Token = require("../auth/Token");
const Password = require("./Password");
const OTP = require("./OTP");

const Model = Sequelize.Model;

class User extends Model {}

User.init(
  {
    username: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize,
    modelName: "user",
  }
);

User.hasMany(Token, { onDelete: "cascade", foreignKey: "userId" });
User.hasMany(Password, { onDelete: "cascade", foreignKey: "userId" });
User.hasOne(OTP, { onDelete: "cascade", foreignKey: "userId" });

module.exports = User;
