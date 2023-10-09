const request = require("supertest");
const app = require("../src/app");
const User = require("../src/user/User");
const sequelize = require("../src/config/database");
const en = require("../locales/en/translation.json");

beforeAll(async () => {
  await sequelize.sync();
});

/* RUNS HOOK BEOFORE EACH TEST */
beforeEach(async () => {
  await User.destroy({ truncate: true });
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
    expect(response.body.message).toBe(en.user_create_success);
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
    field         | value              | expectedMessage
    ${"username"} | ${null}            | ${en.username_null}
    ${"username"} | ${"usr"}           | ${en.username_size}
    ${"username"} | ${"a".repeat(33)}  | ${en.username_size}
    ${"email"}    | ${null}            | ${en.email_null}
    ${"email"}    | ${"mail.com"}      | ${en.email_invalid}
    ${"email"}    | ${"user.mail.com"} | ${en.email_invalid}
    ${"email"}    | ${"user@mail"}     | ${en.email_invalid}
    ${"password"} | ${null}            | ${en.password_null}
    ${"password"} | ${"P4ssw"}         | ${en.password_size}
    ${"password"} | ${"alllowercase"}  | ${en.password_pattern}
    ${"password"} | ${"ALLUPPERCASE"}  | ${en.password_pattern}
    ${"password"} | ${"1234567890"}    | ${en.password_pattern}
    ${"password"} | ${"lowerandUPPER"} | ${en.password_pattern}
    ${"password"} | ${"lower4nd5667"}  | ${en.password_pattern}
    ${"password"} | ${"UPPER44444"}    | ${en.password_pattern}
  `(
    "returns $expectedMessage when $field is $value",
    async ({ field, expectedMessage, value }) => {
      const user = {
        username: "user1",
        email: "user1@mail.com",
        password: "P4ssword",
      };
      user[field] = value;
      const response = await postUser(user);
      const body = response.body;
      expect(body.validationErrors[field]).toBe(expectedMessage);
    }
  );

  it("returns Email in use when same email is already in use", async () => {
    await User.create({ ...validUser });
    const response = await postUser();
    expect(response.body.validationErrors.email).toBe(en.email_inuse);
  });

  it("returns errors for both username is null and email is in use", async () => {
    await User.create({ ...validUser });
    const response = await postUser({
      username: null,
      email: validUser.email,
      password: "P4ssword",
    });

    const body = response.body;
    expect(Object.keys(body.validationErrors)).toEqual(["username", "email"]);
  });
});

// Error model cases
describe("Error Model", () => {
  it("returns path, timestamp, message and validationErrors in response when validation failure", async () => {
    const response = await postUser({ ...validUser, username: null });
    const body = response.body;
    expect(Object.keys(body)).toEqual([
      "path",
      "timestamp",
      "message",
      "validationErrors",
    ]);
  });
  it("returns path in error body", async () => {
    const response = await postUser({ ...validUser, username: null });
    const body = response.body;
    expect(body.path).toEqual("/api/1.0/users");
  });
  it("returns timestamp in milliseconds within 5 seconds in error body", async () => {
    const nowInMillis = new Date().getTime();
    const FiveSecondsLater = nowInMillis + 5 * 1000;
    const response = await postUser({ ...validUser, username: null });
    const body = response.body;
    expect(body.timestamp).toBeGreaterThan(nowInMillis);
    expect(body.timestamp).toBeLessThan(FiveSecondsLater);
  });
});
