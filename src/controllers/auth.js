const UserService = require("../services/UserService");

const register = async (req, res) => {
  if (req.validationErrors) {
    const response = { validationErrors: { ...req.validationErrors } };
    return res.status(400).send(response);
  }
  await UserService.save(req.body);
  return res.send({ message: "User created" });
};

module.exports = register;
