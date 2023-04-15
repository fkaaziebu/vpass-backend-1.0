const UserService = require("../services/UserService");

const register = async (req, res) => {
  await UserService.save(req.body);
  return res.send({ message: "User created" });
};

module.exports = register;
