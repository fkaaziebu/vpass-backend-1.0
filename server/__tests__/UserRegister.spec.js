const request = require("supertest");
const app = require("../app");
const User = require("../src/models/User");
const sequelize = require("../src/config/database");
const SMTPServer = require("smtp-server").SMTPServer;

/* RUNS BEFORE ANY TEST IS RUNNED */
let lastMail, server;
let simulateSmtpFailure = false;

beforeAll(async () => {
  server = new SMTPServer({
    authOptional: true,
    onData(stream, session, callback) {
      let mailBody;
      stream.on("data", (data) => {
        mailBody += data.toString();
      });
      stream.on("end", () => {
        if (simulateSmtpFailure) {
          const err = new Error("Invalid mailbox");
          err.responseCode = 553;
          return callback(err);
        }
        lastMail = mailBody;
        callback();
      });
    },
  });
  await server.listen(8587, "localhost");
  await sequelize.sync();
});

/* RUNS HOOK BEOFORE EACH TEST */
beforeEach(() => {
  simulateSmtpFailure = false;
  return User.destroy({ truncate: true });
});

afterAll(async () => {
  await server.close();
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

  const username_null = "Username cannot be null";
  const username_size = "Must have min 4 and max 32 characters";
  const email_null = "Email cannot be null";
  const email_invalid = "Email is not valid";
  const password_null = "Password cannot be null";
  const password_size = "Password must be atleast 6 characters";
  const password_pattern =
    "Password must have at least 1 uppercase, 1 lowercase letter and 1 number";
  const email_failure = "Email Failure";
  // Dynamic test in jest for similar test
  it.each`
    field         | value              | expectedMessage
    ${"username"} | ${null}            | ${username_null}
    ${"email"}    | ${null}            | ${email_null}
    ${"password"} | ${null}            | ${password_null}
    ${"username"} | ${"usr"}           | ${username_size}
    ${"username"} | ${"a".repeat(33)}  | ${username_size}
    ${"email"}    | ${"mail.com"}      | ${email_invalid}
    ${"email"}    | ${"user.mail.com"} | ${email_invalid}
    ${"email"}    | ${"user@mail"}     | ${email_invalid}
    ${"password"} | ${"P4ssw"}         | ${password_size}
    ${"password"} | ${"alllowercase"}  | ${password_pattern}
    ${"password"} | ${"ALLUPPERCASE"}  | ${password_pattern}
    ${"password"} | ${"1234567890"}    | ${password_pattern}
    ${"password"} | ${"lowerandUPPER"} | ${password_pattern}
    ${"password"} | ${"lower4nd5667"}  | ${password_pattern}
    ${"password"} | ${"UPPER44444"}    | ${password_pattern}
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
    expect(response.body.validationErrors.email).toBe("Email in use");
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

  it("creates user in inactive mode", async () => {
    await postUser();
    const users = await User.findAll();
    const savedUser = users[0];
    expect(savedUser.inactive).toBe(true);
  });

  it("creates user in inactive mode even when the request body contains inactive as false", async () => {
    const newUser = { ...validUser, inactive: false };
    await postUser(newUser);
    const users = await User.findAll();
    const savedUser = users[0];
    expect(savedUser.inactive).toBe(true);
  });

  it("creates an activationToken for user", async () => {
    await postUser();
    const users = await User.findAll();
    const savedUser = users[0];
    expect(savedUser.activationToken).toBeTruthy();
  });

  /* Valid Email request */
  it("sends an account activation email with activationToken", async () => {
    await postUser();
    const users = await User.findAll();
    const savedUser = users[0];
    expect(lastMail).toContain("user1@mail.com");
    expect(lastMail).toContain(savedUser.activationToken);
  });

  /* Invalid Email request */
  it("returns 502 Bad Gateway when sending email fails", async () => {
    simulateSmtpFailure = true;
    const response = await postUser();
    expect(response.status).toBe(502);
  });
  it(`returns ${email_failure} message when sending email fails`, async () => {
    simulateSmtpFailure = true;
    const response = await postUser();
    expect(response.body.message).toBe(email_failure);
  });
  it("does not save user to database if activation email fails", async () => {
    simulateSmtpFailure = true;
    await postUser();
    const users = await User.findAll();
    expect(users.length).toBe(0);
  });
  it("returns Validation Failure message in error response body when validation fails", async () => {
    await User.create({ ...validUser });
    const response = await postUser({
      username: null,
      email: validUser.email,
      password: "P4ssword",
    });

    expect(response.body.message).toEqual("Validation Failure");
  });
});

// Activation of User Account
describe("Account activation", () => {
  const account_activation_failure =
    "This account is either active or the token is invalid";
  const account_activation_success = "Account is activated";

  it("activates the account when correct token is sent", async () => {
    await postUser();
    let users = await User.findAll();
    const token = users[0].activationToken;

    await request(app)
      .post("/api/1.0/users/token/" + token)
      .send();
    users = await User.findAll();
    expect(users[0].inactive).toBe(false);
  });
  it("removes the token from user table after success actvation", async () => {
    await postUser();
    let users = await User.findAll();
    const token = users[0].activationToken;

    await request(app)
      .post("/api/1.0/users/token/" + token)
      .send();
    users = await User.findAll();
    expect(users[0].activationToken).toBeFalsy();
  });
  it("does not activate the account when token is wrong", async () => {
    await postUser();
    let users = await User.findAll();
    const token = "this-token-does-not-exist";

    await request(app)
      .post("/api/1.0/users/token/" + token)
      .send();
    users = await User.findAll();
    expect(users[0].inactive).toBe(true);
  });
  it("returns bad request when token is wrong", async () => {
    await postUser();
    const token = "this-token-does-not-exist";

    const response = await request(app)
      .post("/api/1.0/users/token/" + token)
      .send();
    expect(response.status).toBe(400);
  });

  it.each`
    tokenStatus  | message
    ${"wrong"}   | ${account_activation_failure}
    ${"correct"} | ${account_activation_success}
  `(
    "returns $message when token is $tokenStatus",
    async ({ message, tokenStatus }) => {
      await postUser();
      let token = "this-token-does-not-exist";
      if (tokenStatus === "correct") {
        const users = await User.findAll();
        token = users[0].activationToken;
      }
      const response = await request(app)
        .post("/api/1.0/users/token/" + token)
        .send();
      expect(response.body.message).toBe(message);
    }
  );
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
  it("returns path, timestamp and message in response when request fails other than validation error", async () => {
    const token = "this-token-does-not-exist";
    const response = await request(app)
      .post("/api/1.0/users/token/" + token)
      .send();
    const body = response.body;
    expect(Object.keys(body)).toEqual(["path", "timestamp", "message"]);
  });
  it("returns path in error body", async () => {
    const token = "this-token-does-not-exist";
    const response = await request(app)
      .post("/api/1.0/users/token/" + token)
      .send();
    const body = response.body;
    expect(body.path).toEqual("/api/1.0/users/token/" + token);
  });
  it("returns timestamp in milliseconds within 5 seconds in error body", async () => {
    const nowInMillis = new Date().getTime();
    const FiveSecondsLater = nowInMillis + 5 * 1000;
    const token = "this-token-does-not-exist";
    const response = await request(app)
      .post("/api/1.0/users/token/" + token)
      .send();
    const body = response.body;
    expect(body.timestamp).toBeGreaterThan(nowInMillis);
    expect(body.timestamp).toBeLessThan(FiveSecondsLater);
  });
});
