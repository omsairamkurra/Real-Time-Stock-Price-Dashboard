const request = require("supertest");
const { app } = require("./index"); // Import your Express app

describe("GET /stock/:symbol/:date", () => {
  it("responds with JSON containing stock data", async () => {
    const response = await request(app).get("/stock/AAPL/2022-01-05");
    expect(response.status).toBe(200);
    expect(response.body).toBe(expected); // Adjust to an existing property
  });

  it("responds with error for invalid symbol or date", async () => {
    const response = await request(app).get("/stock/INVALID/2022-01-05");
    expect(response.status).toBe(404); // Adjust to the expected error status
    expect(response.body).toHaveProperty("error"); // Check for an error property in the response
  });
});
