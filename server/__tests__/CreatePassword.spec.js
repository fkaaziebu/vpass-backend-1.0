const request = require("supertest");
const app = require("../src/app");
const User = require("../src/user/User");
const Password = require("../src/user/Password");
const sequelize = require("../src/config/database");
const en = require("../locales/en/translation.json");
const bcrypt = require("bcrypt");

beforeAll(async () => {
  await sequelize.sync();
});

beforeEach(async () => {
  await User.destroy({ truncate: true });
});

const validUser = {
  username: "user1",
  email: "user1@mail.com",
  password: "P4ssword",
};

const addUser = async (user = { ...validUser }) => {
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
  return await User.create(user);
};

const validPassword = {
  description: "Microsoft Password",
  password: "P4ssword",
};

const postAuthentication = async (credentials) => {
  return await request(app).post("/api/1.0/auth").send(credentials);
};

const createPassword = async (pass = validPassword, options = {}) => {
  let agent = request(app).post("/api/1.0/users/create-password/" + options.id);
  if (options.token) {
    agent.set("Authorization", `Bearer ${options.token}`);
  }
  return await agent.send(pass);
};

describe("Create Password", () => {
  it("returns 200 Ok when password creation successful", async () => {
    await addUser();

    const auth = await postAuthentication({
      email: "user1@mail.com",
      password: "P4ssword",
    });

    const response = await createPassword(validPassword, {
      id: auth.body.id,
      token: auth.body.token,
    });
    expect(response.status).toBe(200);
  });

  it("returns returns message when password is created successfully", async () => {
    await addUser();

    const auth = await postAuthentication({
      email: "user1@mail.com",
      password: "P4ssword",
    });

    const response = await createPassword(validPassword, {
      id: auth.body.id,
      token: auth.body.token,
    });

    expect(response.body.message).toBe(en.password_created);
  });

  it("stores password description and password of user in database", async () => {
    await addUser();

    const auth = await postAuthentication({
      email: "user1@mail.com",
      password: "P4ssword",
    });

    await createPassword(validPassword, {
      id: auth.body.id,
      token: auth.body.token,
    });

    const password = await Password.findOne({
      where: {
        userId: auth.body.id,
      },
    });

    expect(password.description).toBe("Microsoft Password");
    expect(password.password).toBe("P4ssword");
  });

  it("returns 403 for unauthorized user", async () => {
    await addUser();

    const auth = await postAuthentication({
      email: "user1@mail.com",
      password: "P4ssword",
    });

    const response = await createPassword(validPassword, {
      id: auth.body.id,
      token: "auth.body.token",
    });

    expect(response.body.message).toBe(en.unauthorized_password_creation);
  });

  it.each`
    field            | value             | expectedMessage
    ${"description"} | ${null}           | ${en.description_null}
    ${"description"} | ${"we"}           | ${en.description_size}
    ${"description"} | ${"e".repeat(65)} | ${en.description_size}
    ${"password"}    | ${null}           | ${en.password_null}
    ${"password"}    | ${"we"}           | ${en.spassword_size}
    ${"password"}    | ${"e".repeat(33)} | ${en.spassword_size}
  `(
    "returns $expectedMessage when $field is $value",
    async ({ field, expectedMessage, value }) => {
      await addUser();

      const auth = await postAuthentication({
        email: "user1@mail.com",
        password: "P4ssword",
      });

      const passToSend = {
        ...validPassword,
      };

      passToSend[field] = value;

      const response = await createPassword(passToSend, {
        id: auth.body.id,
        token: auth.body.token,
      });

      expect(response.body.validationErrors[field]).toBe(expectedMessage);
    }
  );

  it("returns proper error body when validation failure occurs", async () => {
    await addUser();

    const auth = await postAuthentication({
      email: "user1@mail.com",
      password: "P4ssword",
    });

    const passToSend = {
      ...validPassword,
      description: "",
    };

    const nowInMillis = new Date().getTime();

    const response = await createPassword(passToSend, {
      id: auth.body.id,
      token: auth.body.token,
    });

    expect(response.body.path).toBe(
      "/api/1.0/users/create-password/" + auth.body.id
    );
    expect(response.body.message).toBe(en.validation_failure);
    expect(response.body.timestamp).toBeGreaterThan(nowInMillis);
    expect(Object.keys(response.body)).toEqual([
      "path",
      "timestamp",
      "message",
      "validationErrors",
    ]);
  });

  it("returns proper error body when forbidden request occurs", async () => {
    await addUser();

    const auth = await postAuthentication({
      email: "user1@mail.com",
      password: "P4ssword",
    });

    const nowInMillis = new Date().getTime();

    const response = await createPassword(validPassword, {
      id: auth.body.id,
      token: "auth.body.token",
    });

    expect(response.body.path).toBe(
      "/api/1.0/users/create-password/" + auth.body.id
    );
    expect(response.body.message).toBe(en.unauthorized_password_creation);
    expect(response.body.timestamp).toBeGreaterThan(nowInMillis);
    expect(Object.keys(response.body)).toEqual([
      "path",
      "timestamp",
      "message",
    ]);
  });
});
