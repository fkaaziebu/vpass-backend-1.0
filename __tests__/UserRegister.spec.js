const request = require("supertest");
const app = require("../app");

describe("User Registration", () => {
  it("returns 200 Ok when driver signup request is valid", async () => {
    const response = await request(app).post("/api/1.0/users").send();
    expect(response.status).toBe(200);
  });
});
