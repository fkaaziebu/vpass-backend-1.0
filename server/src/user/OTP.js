const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Model = Sequelize.Model;

class OTP extends Model {}

OTP.init(
  {
    userId: {
      type: Sequelize.STRING,
    },
    code: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize,
    modelName: "otp",
  }
);

module.exports = OTP;
