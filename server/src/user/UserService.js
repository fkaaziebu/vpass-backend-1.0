const Password = require("./Password");
const User = require("./User");
const bcrypt = require("bcrypt");

const save = async (body) => {
  const { username, email, password } = body;
  const hash = await bcrypt.hash(password, 10);
  const user = {
    username,
    email,
    password: hash,
  };
  await User.create(user);
};

const findByEmail = async (email) => {
  return await User.findOne({ where: { email: email } });
};

const createPassword = async (id, body) => {
  const { description, password } = body;
  await Password.create({
    userId: id,
    description,
    password,
  });
};

const passwords = async (id) => {
  return await Password.findAll({
    where: { userId: id },
    attributes: ["id", "userId", "description"],
  });
};

const password = async (id, userId) => {
  return await Password.findOne({
    where: { userId: userId, id: id },
    attributes: ["id", "userId", "description"],
  });
};

module.exports = { save, findByEmail, createPassword, passwords, password };
