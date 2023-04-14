const request = require("supertest");
const app = require("../app");

const postUser = () => {
  const response = request(app).post("/api/1.0/users");
  return response.send();
}

describe("User Registration", () => {
  it("returns 200 Ok when user signup request is valid", async () => {
    const response = await postUser();
    expect(response.status).toBe(200);
  });

  it("returns success message when user signup request is valid", async () => {
    const response = await postUser();
    expect(response.body.message).toBe("User created");
  });
});
