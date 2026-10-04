require("dotenv").config();
const request = require("supertest");
const app = require("../src/app");
const {
  connectTestDB,
  clearTestDB,
  closeTestDB,
} = require("./helpers/db");

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

async function registerAndLogin(role, email) {
  await request(app).post("/api/auth/register").send({
    name: "Test " + role,
    email,
    password: "password123",
    role,
  });

  const res = await request(app).post("/api/auth/login").send({
    email,
    password: "password123",
  });

  return res.body.token;
}

const validProfessional = {
  name: "John Electrician",
  service: "Electrical",
  description: "Experienced electrician for home repairs",
  location: "Bengaluru",
  experience: 5,
  price: 500,
};

describe("GET /api/professionals", () => {
  it("is publicly accessible without a token", async () => {
    const res = await request(app).get("/api/professionals");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe("POST /api/professionals", () => {
  it("rejects the request when no token is provided", async () => {
    const res = await request(app)
      .post("/api/professionals")
      .send(validProfessional);

    expect(res.statusCode).toBe(401);
  });

  it("rejects a customer trying to create a listing", async () => {
    const token = await registerAndLogin(
      "customer",
      "cust1@example.com"
    );

    const res = await request(app)
      .post("/api/professionals")
      .set("Authorization", `Bearer ${token}`)
      .send(validProfessional);

    expect(res.statusCode).toBe(403);
  });

  it("allows a professional to create their own listing", async () => {
    const token = await registerAndLogin(
      "professional",
      "pro1@example.com"
    );

    const res = await request(app)
      .post("/api/professionals")
      .set("Authorization", `Bearer ${token}`)
      .send(validProfessional);

    expect(res.statusCode).toBe(201);
    expect(res.body.professional.name).toBe(
      validProfessional.name
    );
    expect(res.body.professional.user).toBeDefined();
  });

  it("rejects an incomplete listing with a 400 validation error", async () => {
    const token = await registerAndLogin(
      "professional",
      "pro2@example.com"
    );

    const res = await request(app)
      .post("/api/professionals")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Incomplete Pro" });

    expect(res.statusCode).toBe(400);
  });
});

describe("PUT /api/professionals/:id and DELETE /api/professionals/:id", () => {
  async function createListing() {
    const token = await registerAndLogin(
      "professional",
      "owner@example.com"
    );

    const createRes = await request(app)
      .post("/api/professionals")
      .set("Authorization", `Bearer ${token}`)
      .send(validProfessional);

    return {
      token,
      id: createRes.body.professional._id,
    };
  }

  it("lets the owner update their own listing", async () => {
    const { token, id } = await createListing();

    const res = await request(app)
      .put(`/api/professionals/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ price: 650 });

    expect(res.statusCode).toBe(200);
    expect(res.body.professional.price).toBe(650);
  });

  it("blocks a different professional from updating someone else's listing", async () => {
    const { id } = await createListing();

    const otherToken = await registerAndLogin(
      "professional",
      "other@example.com"
    );

    const res = await request(app)
      .put(`/api/professionals/${id}`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ price: 999 });

    expect(res.statusCode).toBe(403);
  });

  it("blocks a different professional from deleting someone else's listing", async () => {
    const { id } = await createListing();

    const otherToken = await registerAndLogin(
      "professional",
      "other2@example.com"
    );

    const res = await request(app)
      .delete(`/api/professionals/${id}`)
      .set("Authorization", `Bearer ${otherToken}`);

    expect(res.statusCode).toBe(403);
  });

  it("lets the owner delete their own listing", async () => {
    const { token, id } = await createListing();

    const res = await request(app)
      .delete(`/api/professionals/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it("returns 400 for a malformed ID", async () => {
    const { token } = await createListing();

    const res = await request(app)
      .put("/api/professionals/not-a-valid-id")
      .set("Authorization", `Bearer ${token}`)
      .send({ price: 100 });

    expect(res.statusCode).toBe(400);
  });
});