const request = require("supertest");
const app = require("../src/app");
const User = require("../src/user/User");
const sequelize = require("../src/config/database");
const bcrypt = require("bcrypt");
const Password = require("../src/user/Password");
const OTP = require("../src/user/OTP");
const en = require("../locales/en/translation.json");

beforeAll(async () => {
  await sequelize.sync();
});

beforeEach(async () => {
  await User.destroy({ truncate: true });
});

const activeUser = {
  username: "user1",
  email: "user1@mail.com",
  password: "P4ssword",
};
const addUser = async (user = { ...activeUser }) => {
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
  return await User.create(user);
};

const postAuthentication = async (credentials) => {
  return await request(app).post("/api/1.0/auth").send(credentials);
};

const validPassword = {
  description: "Microsoft Password",
  password: "P4ssword",
};

const createPassword = async (pass = validPassword, options = {}) => {
  let agent = request(app).post("/api/1.0/users/create-password/" + options.id);
  if (options.token) {
    agent.set("Authorization", `Bearer ${options.token}`);
  }
  return await agent.send(pass);
};

const createOTP = async (options = {}) => {
  let agent = request(app).post(
    "/api/1.0/otp/" + options.id + "/" + options.userId
  );

  if (options.token) {
    agent.set("Authorization", `Bearer ${options.token}`);
  }

  return await agent.send();
};

const verifyOTP = async (otp, options = {}) => {
  let agent = request(app).post(
    "/api/1.0/otp/" + options.id + "/" + options.userId + "/" + "verify"
  );

  if (options.token) {
    agent.set("Authorization", `Bearer ${options.token}`);
  }

  return await agent.send({ otp });
};

describe("Verify OTP", () => {
  it("returns 200 ok when OTP verification successful", async () => {
    await addUser();
    const auth = await postAuthentication({
      email: "user1@mail.com",
      password: "P4ssword",
    });

    await createPassword(validPassword, {
      token: auth.body.token,
      id: auth.body.id,
      ...validPassword,
    });

    const pass = await Password.findOne({
      where: {
        userId: auth.body.id,
      },
    });

    await createOTP({
      token: auth.body.token,
      userId: auth.body.id,
      id: pass.id,
    });

    const otp = await OTP.findOne({
      where: { userId: auth.body.id },
    });

    const response = await verifyOTP(otp.code, {
      token: auth.body.token,
      userId: auth.body.id,
      id: pass.id,
    });

    expect(response.status).toBe(200);
  });

  it("returns 403 when otp is not correct", async () => {
    await addUser();
    const auth = await postAuthentication({
      email: "user1@mail.com",
      password: "P4ssword",
    });

    await createPassword(validPassword, {
      token: auth.body.token,
      id: auth.body.id,
      ...validPassword,
    });

    const pass = await Password.findOne({
      where: {
        userId: auth.body.id,
      },
    });

    await createOTP({
      token: auth.body.token,
      userId: auth.body.id,
      id: pass.id,
    });

    const response = await verifyOTP("otp.code", {
      token: auth.body.token,
      userId: auth.body.id,
      id: pass.id,
    });

    expect(response.status).toBe(403);
  });

  it("returns message when otp is not correct", async () => {
    await addUser();
    const auth = await postAuthentication({
      email: "user1@mail.com",
      password: "P4ssword",
    });

    await createPassword(validPassword, {
      token: auth.body.token,
      id: auth.body.id,
      ...validPassword,
    });

    const pass = await Password.findOne({
      where: {
        userId: auth.body.id,
      },
    });

    await createOTP({
      token: auth.body.token,
      userId: auth.body.id,
      id: pass.id,
    });

    await OTP.findOne({
      where: { userId: auth.body.id },
    });

    const response = await verifyOTP("otp.code", {
      token: auth.body.token,
      userId: auth.body.id,
      id: pass.id,
    });

    expect(response.body.message).toBe(en.incorrect_otp);
  });

  it("returns particular password with password field in it when request successful", async () => {
    await addUser();
    const auth = await postAuthentication({
      email: "user1@mail.com",
      password: "P4ssword",
    });

    await createPassword(validPassword, {
      token: auth.body.token,
      id: auth.body.id,
      ...validPassword,
    });

    const pass = await Password.findOne({
      where: {
        userId: auth.body.id,
      },
    });

    await createOTP({
      token: auth.body.token,
      userId: auth.body.id,
      id: pass.id,
    });

    const otp = await OTP.findOne({
      where: { userId: auth.body.id },
    });

    const response = await verifyOTP(otp.code, {
      token: auth.body.token,
      userId: auth.body.id,
      id: pass.id,
    });

    expect(Object.keys(response.body.password)).toEqual([
      "id",
      "userId",
      "description",
      "password",
    ]);
  });
});
