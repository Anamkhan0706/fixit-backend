# FixIt Backend API

Backend API for the FixIt local home-services booking platform, built as the
Week 3 internship deliverable. It provides authentication, professional
listing management, and booking management, backed by MongoDB.

## 1. Project Overview

FixIt connects customers with local service professionals (plumbers,
electricians, carpenters, etc.). This backend provides RESTful APIs for:

- User registration and login (customer and professional roles)
- JWT-based authentication and role-based authorization
- Professional listing management (CRUD), scoped to the owning professional
- Booking management (CRUD), scoped to the owning customer
- Input validation on every write endpoint
- Centralized error handling
- Automated tests (Jest + Supertest) and a manual REST Client test file

## 2. Technology Stack

- Node.js / Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken) for authentication
- bcryptjs for password hashing
- express-validator for request validation
- Jest + Supertest for automated testing
- VS Code REST Client (`test-api.http`) for manual testing

## 3. Project Structure

```text
fixit-backend/
├── src/
│   ├── config/
│   │   └── database.js          MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── professionalController.js
│   │   └── bookingController.js
│   ├── middleware/
│   │   ├── authMiddleware.js     protect + restrictTo (role-based access)
│   │   ├── errorMiddleware.js    centralized error handler
│   │   └── validationMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Professional.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── professionalRoutes.js
│   │   └── bookingRoutes.js
│   ├── app.js                    Express app (exported for testing)
│   └── server.js                 Entry point: connects DB, starts server
├── tests/
│   ├── helpers/db.js              Test database connect/clear/close helpers
│   ├── auth.test.js
│   ├── professionals.test.js
│   └── bookings.test.js
├── docs/
│   └── API.md                     Full endpoint reference
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## 4. Installation & Running Locally

**Requirements:** Node.js 18+, npm, and a MongoDB instance (local or Atlas).

1. Install dependencies:

```bash
   npm install
```

2. Create a `.env` file in the project root (copy `.env.example` and fill in
   real values — never commit this file):

```text
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
```

3. Start the server in development mode (auto-restarts on file changes):

```bash
   npm run dev
```

   Or start it normally:

```bash
   npm start
```

4. Confirm it's running by visiting `http://localhost:5000/` or
   `http://localhost:5000/api/health` in your browser — both should return
   a JSON success message.

## 5. Running Tests

Automated tests use Jest and Supertest, and connect to a separate `_test`
database (derived automatically from `MONGO_URI`, so your real data is never
touched). Run them with:

```bash
npm test
```

You can also test manually using the included `test-api.http` file with the
VS Code "REST Client" extension — open the file and click "Send Request"
above each request.

## 6. API Documentation

Full endpoint reference — every route, required/optional parameters, request
and response examples, and status codes — is in
[`docs/API.md`](./docs/API.md).

## 7. Security Notes

- Passwords are hashed with bcrypt before being stored; they are never
  returned in any API response.
- JWT tokens are required for all professional-listing writes and all
  booking operations.
- A professional listing can only be edited or deleted by the professional
  who owns it (or an admin) — enforced server-side, not just in the UI.
- A booking can only be viewed, edited, or deleted by the customer who
  created it — enforced server-side.
- Users can never assign themselves the `admin` role at registration,
  regardless of what the client sends.
- `.env` is excluded from version control via `.gitignore` — never commit
  real secrets.