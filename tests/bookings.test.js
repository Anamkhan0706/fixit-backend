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

async function createProfessionalListing() {
  const proToken = await registerAndLogin(
    "professional",
    "bookingpro@example.com"
  );

  const res = await request(app)
    .post("/api/professionals")
    .set("Authorization", `Bearer ${proToken}`)
    .send({
      name: "Priya Electrician",
      service: "Electrical",
      description: "Reliable electrician",
      location: "Bengaluru",
      experience: 5,
      price: 400,
    });

  return res.body.professional._id;
}

describe("POST /api/bookings", () => {
  it("rejects booking creation without a token", async () => {
    const res = await request(app)
      .post("/api/bookings")
      .send({});

    expect(res.statusCode).toBe(401);
  });

  it("creates a booking for the authenticated customer", async () => {
    const professionalId =
      await createProfessionalListing();

    const customerToken = await registerAndLogin(
      "customer",
      "bookcust@example.com"
    );

    const res = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        professional: professionalId,
        service: "Electrical",
        date: "2026-10-05",
        time: "11:00 AM",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.booking.service).toBe("Electrical");
    expect(res.body.booking.user).toBeDefined();
    expect(res.body.booking.amount).toBe(400);
  });

  it("rejects a booking with an invalid professional ID", async () => {
    const customerToken = await registerAndLogin(
      "customer",
      "bookcust2@example.com"
    );

    const res = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        professional: "not-a-valid-id",
        service: "Electrical",
        date: "2026-10-05",
        time: "11:00 AM",
      });

    expect(res.statusCode).toBe(400);
  });
});

describe("GET /api/bookings", () => {
  it("only returns bookings belonging to the logged-in user", async () => {
    const professionalId =
      await createProfessionalListing();

    const customerAToken = await registerAndLogin(
      "customer",
      "customerA@example.com"
    );

    const customerBToken = await registerAndLogin(
      "customer",
      "customerB@example.com"
    );

    await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${customerAToken}`)
      .send({
        professional: professionalId,
        service: "Electrical",
        date: "2026-10-05",
        time: "11:00 AM",
      });

    const resA = await request(app)
      .get("/api/bookings")
      .set("Authorization", `Bearer ${customerAToken}`);

    const resB = await request(app)
      .get("/api/bookings")
      .set("Authorization", `Bearer ${customerBToken}`);

    expect(resA.body.count).toBe(1);
    expect(resB.body.count).toBe(0);
  });
});

describe("PUT /api/bookings/:id and DELETE /api/bookings/:id", () => {
  async function createBooking() {
    const professionalId =
      await createProfessionalListing();

    const token = await registerAndLogin(
      "customer",
      "bookingowner@example.com"
    );

    const createRes = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({
        professional: professionalId,
        service: "Electrical",
        date: "2026-10-05",
        time: "11:00 AM",
      });

    return {
      token,
      id: createRes.body.booking._id,
    };
  }

  it("lets the owner update their own booking details", async () => {
    const { token, id } = await createBooking();

    const res = await request(app)
      .put(`/api/bookings/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        date: "2026-10-06",
        time: "2:00 PM",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.booking.date).toBe("2026-10-06");
    expect(res.body.booking.time).toBe("2:00 PM");
  });

  it("prevents the customer from changing the booking status", async () => {
    const { token, id } = await createBooking();

    const res = await request(app)
      .put(`/api/bookings/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "confirmed",
      });

    expect(res.statusCode).toBe(400);
  });

  it("hides another user's booking with a 404 rather than exposing it", async () => {
    const { id } = await createBooking();

    const otherToken = await registerAndLogin(
      "customer",
      "notowner@example.com"
    );

    const res = await request(app)
      .put(`/api/bookings/${id}`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({
        date: "2026-10-07",
      });

    expect(res.statusCode).toBe(404);
  });

  it("lets the owner delete their own booking", async () => {
    const { token, id } = await createBooking();

    const res = await request(app)
      .delete(`/api/bookings/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});