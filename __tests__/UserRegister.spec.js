const request = require("supertest");
const app = require("../app");
const User = require("../src/models/User");
const sequelize = require("../src/config/database");

/* RUNS BEFORE ANY TEST IS RUNNED */
beforeAll(() => {
  return sequelize.sync();
  // jest.setTimeout(20000);
});

/* RUNS HOOK BEOFORE EACH TEST */
beforeEach(() => {
  return User.destroy({ truncate: true });
});

const validUser = {
  username: "user1",
  email: "user1@mail.com",
  password: "P4ssword",
};

const postUser = (user = validUser) => {
  return request(app).post("/api/1.0/users").send(user);
};

describe("User Registration", () => {
  /* Valid Reuqest */
  it("returns 200 Ok when user signup request is valid", async () => {
    const response = await postUser();
    expect(response.status).toBe(200);
  });

  it("returns success message when user signup request is valid", async () => {
    const response = await postUser();
    expect(response.body.message).toBe("User created");
  });

  it("saves the user to database", async () => {
    await postUser();
    const userList = await User.findAll();
    expect(userList.length).toBe(1);
  });

  it("saves the username and email to database", async () => {
    await postUser();
    const userList = await User.findAll();
    const savedUser = userList[0];
    expect(savedUser.username).toBe("user1");
    expect(savedUser.email).toBe("user1@mail.com");
  });

  it("hashes the password in database", async () => {
    await postUser();
    const userList = await User.findAll();
    const savedUser = userList[0];
    expect(savedUser.password).not.toBe("P4ssword");
  });

  /* Invalid Request */
  it("returns 400 when username is null", async () => {
    const response = await postUser({
      username: null,
      email: "user1@mail.com",
      password: "P4ssword",
    });
    expect(response.status).toBe(400);
  });

  it("returns validationErrors field in response body when validation error occurs", async () => {
    const response = await postUser({
      username: null,
      email: "user1@mail.com",
      password: "P4ssword",
    });
    const body = response.body;
    expect(body.validationErrors).not.toBeUndefined();
  });

  it("returns errors for both when username and email is null", async () => {
    const response = await postUser({
      username: null,
      email: null,
      password: "P4ssword",
    });
    const body = response.body;
    expect(Object.keys(body.validationErrors)).toEqual(["username", "email"]);
  });

  // Dynamic test in jest for similar test
  it.each`
    field         | expectedMessage
    ${"username"} | ${"Username cannot be null"}
    ${"email"}    | ${"Email cannot be null"}
    ${"password"} | ${"Password cannot be null"}
  `(
    "returns $expectedMessage when $field is null",
    async ({ field, expectedMessage }) => {
      const user = {
        username: "user1",
        email: "user1@mail.com",
        password: "P4ssword",
      };
      user[field] = null;
      const response = await postUser(user);
      const body = response.body;
      expect(body.validationErrors[field]).toBe(expectedMessage);
    }
  );
});
