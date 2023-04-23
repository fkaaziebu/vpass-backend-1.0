const UserService = require("../services/UserService");
const { validationResult } = require("express-validator");
const ValidationException = require("../error/ValidationException");

const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ValidationException(errors.array()));
  }
  try {
    await UserService.save(req.body);
    return res.send({ message: "User created" });
  } catch (err) {
    next(err);
  }
};

module.exports = register;
