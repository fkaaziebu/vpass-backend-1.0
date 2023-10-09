const request = require("supertest");
const app = require("../src/app");
const User = require("../src/user/User");
const sequelize = require("../src/config/database");
const bcrypt = require("bcrypt");
const Password = require("../src/user/Password");

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

const getPassword = async (options = {}) => {
  let agent = request(app).get(
    "/api/1.0/password/" + options.id + "/" + options.userId
  );

  if (options.token) {
    agent.set("Authorization", `Bearer ${options.token}`);
  }

  return await agent.send();
};

describe("List Passwords", () => {
  it("returns 200 ok when Password listing successfull", async () => {
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

    const response = await getPassword({
      token: auth.body.token,
      userId: auth.body.id,
      id: pass.id,
    });

    expect(response.status).toBe(200);
  });

  it("returns specific password when successful", async () => {
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

    const response = await getPassword({
      token: auth.body.token,
      userId: auth.body.id,
      id: pass.id,
    });

    expect(response.body.password.description).toBe("Microsoft Password");
  });
  it("returns id, userId and description when successful request", async () => {
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

    const response = await getPassword({
      token: auth.body.token,
      userId: auth.body.id,
      id: pass.id,
    });

    expect(Object.keys(response.body.password)).toEqual([
      "id",
      "userId",
      "description",
    ]);
  });
});
