const UserService = require("../services/UserService");

const activate = async (req, res, next) => {
  const token = req.params.token;
  try {
    await UserService.activate(token);
    res.send({ message: "Account is activated" });
  } catch (err) {
    next(err);
  }
};

module.exports = activate;
