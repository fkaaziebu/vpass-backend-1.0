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

describe("User Registration", () => {
  const postValidUser = () => {
    return request(app).post("/api/1.0/users").send({
      username: "user1",
      email: "user1@mail.com",
      password: "P4ssword",
    });
  };

  it("returns 200 Ok when user signup request is valid", async () => {
    const response = await postValidUser();
    expect(response.status).toBe(200);
  });

  it("returns success message when user signup request is valid", async () => {
    const response = await postValidUser();
    expect(response.body.message).toBe("User created");
  });

  it("saves the user to database", async () => {
    await postValidUser();
    const userList = await User.findAll();
    expect(userList.length).toBe(1);
  });

  it("saves the username and email to database", async () => {
    await postValidUser();
    const userList = await User.findAll();
    const savedUser = userList[0];
    expect(savedUser.username).toBe("user1");
    expect(savedUser.email).toBe("user1@mail.com");
  });

  it("hashes the password in database", async () => {
    await postValidUser();
    const userList = await User.findAll();
    const savedUser = userList[0];
    expect(savedUser.password).not.toBe("P4ssword");
  });
});
