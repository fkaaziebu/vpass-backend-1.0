const request = require("supertest");
const app = require("../src/app");
const User = require("../src/user/User");
const sequelize = require("../src/config/database");
const bcrypt = require("bcrypt");
const Password = require("../src/user/Password");
const OTP = require("../src/user/OTP");
const SMTPServer = require("smtp-server").SMTPServer;

/* MAIL SERVICE */
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
  jest.setTimeout(20000);
});

beforeEach(async () => {
  simulateSmtpFailure = false;
  await User.destroy({ truncate: true });
});

afterAll(async () => {
  await server.close();
  jest.setTimeout(5000);
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

describe("Generate OTP", () => {
  it("returns 200 ok when OTP generated successfully", async () => {
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

    const response = await createOTP({
      token: auth.body.token,
      userId: auth.body.id,
      id: pass.id,
    });

    expect(response.status).toBe(200);
  });

  it("creates otp code when request successful", async () => {
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
      where: {
        userId: auth.body.id,
      },
    });

    expect(otp.code).not.toBeUndefined();
  });
  it("returns success message when request successful", async () => {
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

    const response = await createOTP({
      token: auth.body.token,
      userId: auth.body.id,
      id: pass.id,
    });

    expect(response.body.message).toBe("OTP created");
  });

  it("returns current otp when multiple otps are generated", async () => {
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

    const otp1 = await OTP.findOne({
      where: { userId: auth.body.id },
    });

    await createOTP({
      token: auth.body.token,
      userId: auth.body.id,
      id: pass.id,
    });

    const otp2 = await OTP.findOne({
      where: { userId: auth.body.id },
    });

    expect(otp1.code).not.toBe(otp2.code);
  });
});

describe("Send Email", () => {
  /* Valid Email request */
  it("sends email with otp", async () => {
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

    expect(lastMail).toContain("user1@mail.com");
    expect(lastMail).toContain(otp.code);
  });

  /* Invalid Email request */
  it("returns 502 Bad Gateway when sending email fails", async () => {
    simulateSmtpFailure = true;
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

    const response = await createOTP({
      token: auth.body.token,
      userId: auth.body.id,
      id: pass.id,
    });

    expect(response.status).toBe(502);
  });
});
