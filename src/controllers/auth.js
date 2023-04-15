const UserService = require("../services/UserService");
const { validationResult } = require("express-validator");

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors = {};
    errors.array().forEach((error) => {
      validationErrors[error.param] = error.msg;
    });
    return res.status(400).send({ validationErrors: validationErrors });
  }
  await UserService.save(req.body);
  return res.send({ message: "User created" });
};

module.exports = register;
