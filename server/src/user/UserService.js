const OTP = require("./OTP");
const Password = require("./Password");
const User = require("./User");
const bcrypt = require("bcrypt");
const generateOTP = require("../shared/generateOTP");
const ForbiddenException = require("../error/ForbiddenException");
const en = require("../../locales/en/translation.json");
const EmailService = require("../email/EmailService");
const EmailException = require("../email/EmailException");

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
    attributes: ["id", "userId", "description", "createdAt"],
  });
};

const password = async (id, userId) => {
  return await Password.findOne({
    where: { userId: userId, id: id },
    attributes: ["id", "userId", "description"],
  });
};

const createOTP = async (email, userId) => {
  await OTP.destroy({ where: { userId: userId } });
  const otp = await OTP.create({
    userId: userId,
    code: generateOTP(),
  });

  try {
    await EmailService.sendOTP(email, otp.code);
  } catch (err) {
    throw new EmailException();
  }
};

const verifyOTP = async (userId, id, otp) => {
  const response = await OTP.findOne({ where: { userId: userId } });
  const isOTPCorrect = response.code === otp;
  if (!isOTPCorrect) {
    throw new ForbiddenException(en.incorrect_otp);
  }
  return await Password.findOne({
    where: { userId: userId, id: id },
    attributes: ["id", "userId", "description", "password"],
  });
};

const verifyOTPForDelete = async (userId, id, otp) => {
  const response = await OTP.findOne({ where: { userId: userId } });
  const isOTPCorrect = response.code === otp;
  return isOTPCorrect;
};

const deletePassword = async (userId, id) => {
  await Password.destroy({
    where: {
      userId: userId,
      id: id,
    },
  });
};

const getEmail = async (userId) => {
  const user = await User.findOne({ where: { id: userId } });
  return user.email;
};

module.exports = {
  save,
  findByEmail,
  createPassword,
  passwords,
  password,
  createOTP,
  verifyOTP,
  deletePassword,
  verifyOTPForDelete,
  getEmail,
};
