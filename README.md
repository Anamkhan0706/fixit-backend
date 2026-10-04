# FixIt Backend API

Backend API for **FixIt**, a full-stack local home-services booking platform.

The backend is built with Node.js, Express.js, and MongoDB. It provides RESTful APIs consumed by the React frontend for authentication, professional listings, bookings, reviews, ratings, and professional earnings.

This backend was originally developed as part of the Week 3 internship deliverable and was integrated with the FixIt React frontend during Week 4.

---

## 1. Project Overview

FixIt connects customers with local service professionals such as painters, plumbers, electricians, carpenters, and other home-service providers.

The backend provides APIs for:

- Customer and professional registration
- User login and JWT authentication
- Role-based authorization
- Professional profile and listing management
- Customer booking creation
- Professional booking management
- Booking status tracking
- Booking amount management
- Customer reviews and ratings
- Professional rating calculation
- Input validation
- Ownership-based access control
- Centralized error handling
- Automated API testing using Jest and Supertest

The React frontend communicates with these APIs using asynchronous HTTP requests.

---

## 2. Full-Stack Architecture

The FixIt application consists of three main layers:

```text
React Frontend
      |
      | HTTP requests using fetch()
      | JSON + JWT Authorization
      v
Node.js + Express Backend
      |
      | Mongoose
      v
MongoDB Atlas
```

**Frontend**

The frontend is built with:

- React
- React Router
- Vite
- Tailwind CSS
- Lucide React
- Browser Fetch API

**Backend**

The backend is built with:

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens
- bcryptjs
- express-validator

**Database**

MongoDB stores:

- Users
- Professional profiles
- Bookings
- Reviews

---

## 3. Technology Stack

**Backend**

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (jsonwebtoken)
- bcryptjs
- express-validator
- Jest
- Supertest

**Frontend**

- React
- Vite
- React Router
- Tailwind CSS
- Lucide React
- Fetch API

**Development Tools**

- Visual Studio Code
- Git
- GitHub
- MongoDB Atlas
- VS Code REST Client

---

## 4. Project Structure

```text
fixit-backend/

├── src/
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── professionalController.js
│   │   ├── bookingController.js
│   │   └── reviewController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validationMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Professional.js
│   │   ├── Booking.js
│   │   └── Review.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── professionalRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── reviewRoutes.js
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│   ├── helpers/
│   │   └── db.js
│   ├── auth.test.js
│   ├── professionals.test.js
│   └── bookings.test.js
│
├── docs/
│   └── API.md
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## 5. Installation Requirements

Before running the project locally, install:

- Node.js 18 or later
- npm
- MongoDB Atlas account or local MongoDB installation
- Git
- Visual Studio Code (recommended)

---

## 6. Backend Installation

Open a terminal in the backend directory:

```bash
cd fixit-backend
```

Install dependencies:

```bash
npm install
```

---

## 7. Environment Variables

Create a `.env` file in the backend project root.

Example:

```text
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Never commit the real .env file to GitHub.

The .env file is excluded using .gitignore.

---

## 8. Start the Backend

Start the backend normally:

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

The terminal should display messages similar to:

```text
FixIt Backend Server running on port 5000
MongoDB connected successfully
```

---

## 9. Frontend Setup

The frontend is maintained in a separate repository.

Clone the frontend repository:

```bash
git clone https://github.com/Anamkhan0706/fixit-frontend.git
```

Open the frontend directory:

```bash
cd fixit-frontend
```

Install dependencies:

```bash
npm install
```

Create a .env file in the frontend root:

```text
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Vite will provide a local development URL, normally:

```text
http://localhost:5173
```

---

## 10. Running the Complete Application

The frontend and backend should run simultaneously.

**Terminal 1 — Backend**

```bash
cd fixit-backend
npm start
```

Backend:

```text
http://localhost:5000
```

**Terminal 2 — Frontend**

```bash
cd fixit-frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

The frontend communicates with the backend using:

```text
VITE_API_URL=http://localhost:5000/api
```

---

## 11. Frontend and Backend Integration

During Week 4, the React frontend was connected to the backend APIs.

The frontend uses the browser Fetch API to communicate with the backend asynchronously.

Examples of integrated functionality include:

**Authentication**

The frontend sends registration and login requests to the backend.

The backend:

- Validates the request
- Creates or authenticates the user
- Generates a JWT
- Returns the authenticated user information

The frontend stores the authentication token and uses it for protected API requests.

**Professional Listings**

The frontend retrieves real professional data from MongoDB through the backend.

The professional information includes:

- Name
- Service
- Description
- Location
- Experience
- Rating
- Price
- Availability

This replaced the earlier dependence on static/mock professional data.

**Booking Creation**

Customers can create bookings directly from the frontend.

The frontend sends booking information to:

```text
POST /api/bookings
```

The backend validates the request, verifies the professional, and stores the booking in MongoDB.

The booking amount is taken from the professional's stored hourly price rather than being trusted from the client.

**Booking Tracking**

Customers can view their bookings from the frontend.

Bookings display statuses such as:

- Requested
- Accepted
- In Progress
- Completed
- Cancelled

The frontend retrieves the current booking information from the backend.

**Professional Dashboard**

Professionals can manage customer orders through the dashboard.

The dashboard displays:

- Pending orders
- Completed jobs
- Total earnings
- Earnings history
- Customer information
- Booking dates and times
- Booking amounts
- Booking status

**Reviews and Ratings**

Customers can submit reviews after completing a booking.

A review contains:

- Rating
- Comment
- Booking reference
- Customer
- Professional

The backend recalculates the professional's average rating after a review is submitted.

The frontend displays the professional's reviews and rating.

---

## 12. API Authentication

Protected requests use JWT authentication.

The frontend sends the token using the HTTP Authorization header:

```text
Authorization: Bearer <token>
```

The backend authentication middleware verifies the token before allowing access to protected resources.

Role-based access is used for customer and professional operations.

---

## 13. Booking Security

Booking updates were secured during Week 4.

Customers can update:
- Date
- Time
- Address
- Issue description

Professionals can update:
- Booking status

Sensitive fields cannot be changed through the booking update API.

Customers and professionals cannot modify:

- Booking amount
- Customer ownership
- Assigned professional

These rules are enforced on the backend rather than relying only on frontend restrictions.

---

## 14. Input Validation

The backend uses express-validator and Mongoose validation.

Validation is applied to important write operations such as:

- Registration
- Professional creation
- Booking creation
- Review creation

Invalid input returns appropriate HTTP error responses instead of being stored in the database.

---

## 15. Automated Testing

The backend uses Jest and Supertest.

Run the complete test suite:

```bash
npm test
```

The Week 4 integration work was verified with:

```text
Test Suites: 3 passed, 3 total
Tests:       26 passed, 26 total
Snapshots:   0 total
```

The test suites cover:

- Authentication
- Professional management
- Booking creation
- Booking retrieval
- Booking ownership
- Booking updates
- Booking deletion
- Input validation
- Booking security

---

## 16. End-to-End Integration Testing

The integrated application was also tested manually through the browser.

The following workflow was verified:

```text
Customer Login
      ↓
Browse Professionals
      ↓
Open Professional Profile
      ↓
Create Booking
      ↓
Booking Stored in MongoDB
      ↓
Professional Receives Order
      ↓
Professional Accepts Booking
      ↓
Customer Sees Updated Status
```

Real booking information was displayed on both customer and professional dashboards.

---

## 17. Challenges Encountered and Solutions

**Challenge 1 — Connecting frontend data to the backend**

The frontend initially contained mock/static professional information.

Solution:

The frontend was updated to retrieve professional information from the backend API and display real MongoDB data.

**Challenge 2 — Authentication across frontend and backend**

Protected backend endpoints require authentication.

Solution:

JWT tokens are stored by the frontend after login and included in the Authorization header for protected requests.

**Challenge 3 — Booking ownership and security**

Users should not be able to modify another customer's booking or sensitive booking fields.

Solution:

Backend authorization was added so that database operations are scoped to the authenticated user and professional role.

**Challenge 4 — Booking amount security**

The booking amount should not be controlled by the customer through the frontend.

Solution:

The backend retrieves the professional's stored price and uses it when creating the booking.

**Challenge 5 — Test failures after model validation changes**

Adding required professional experience validation caused existing automated tests to fail.

Solution:

The affected tests were updated to include valid professional experience data. The final test suite passed all 26 tests.

**Challenge 6 — Review integration**

Reviews needed to be connected to completed bookings and professionals.

Solution:

A Review model, controller, routes, validation, and rating recalculation logic were implemented and integrated with the frontend.

---

## 18. Security Practices

The project follows several backend security practices:

- Passwords are hashed using bcryptjs.
- Passwords are never returned in API responses.
- JWT authentication protects private endpoints.
- Role-based authorization restricts customer and professional actions.
- Users cannot assign themselves the admin role during registration.
- Booking ownership is checked server-side.
- Professional listing ownership is checked server-side.
- Sensitive booking fields cannot be modified by unauthorized users.
- Environment variables are stored outside source control.

---

## 19. GitHub Repositories

**Backend**

https://github.com/Anamkhan0706/fixit-backend

**Frontend**

https://github.com/Anamkhan0706/fixit-frontend

---

## 20. Conclusion

Week 4 focused on integrating the FixIt React frontend with the Node.js/Express backend.

The completed integration allows users to register and log in, browse real professionals, create bookings, track booking status, manage professional orders, view earnings, and submit reviews.

The frontend communicates with the backend through REST APIs, while MongoDB provides persistent storage.

The application was tested both through automated backend tests and manual end-to-end browser testing. The final automated backend test suite passed all 26 tests successfully.

The completed integration demonstrates a functional full-stack home-services booking application with authentication, authorization, database persistence, API communication, validation, booking management, reviews, and professional earnings tracking.