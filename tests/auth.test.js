require("dotenv").config();
const request = require("supertest");
const app = require("../src/app");
const { connectTestDB, clearTestDB, closeTestDB } = require("./helpers/db");

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

describe("POST /api/auth/register", () => {
  it("registers a new customer and returns 201", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.role).toBe("customer");
    expect(res.body.user.password).toBeUndefined();
  });

  it("allows registering as a professional when explicitly requested", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test Pro",
      email: "pro@example.com",
      password: "password123",
      role: "professional",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.role).toBe("professional");
  });

  it("never allows self-assigning the admin role", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Sneaky User",
      email: "sneaky@example.com",
      password: "password123",
      role: "admin",
    });

    if (res.statusCode === 201) {
      expect(res.body.user.role).not.toBe("admin");
    } else {
      expect(res.statusCode).toBe(400);
    }
  });

  it("rejects registration with missing fields", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "incomplete@example.com",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects duplicate email registration", async () => {
    await request(app).post("/api/auth/register").send({
      name: "First User",
      email: "duplicate@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/register").send({
      name: "Second User",
      email: "duplicate@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(409);
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await request(app).post("/api/auth/register").send({
      name: "Login Test",
      email: "login@example.com",
      password: "password123",
    });
  });

  it("logs in with correct credentials and returns a token", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.token).toBe("string");
  });

  it("rejects an incorrect password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
  });

  it("rejects a login for an email that doesn't exist", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nobody@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(401);
  });
});