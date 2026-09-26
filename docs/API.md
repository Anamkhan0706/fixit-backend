# FixIt Backend API Documentation

## 1. API Overview

FixIt is a RESTful backend API for a local home-services booking platform.

### Base URL

```text
http://localhost:5000/api
```

### Technology Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* express-validator

---

# 2. Authentication

Protected endpoints require a JSON Web Token (JWT).

Add the token to the request header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

---

# 3. Authentication APIs

## 3.1 Register User

### Endpoint

```text
POST /auth/register
```

### Description

Registers a new FixIt customer.

### Authentication

Not required.

### Request Body

```json
{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "Test@123456",
  "role": "customer"
}
```

### Required Parameters

| Parameter | Type   | Required | Description            |
| --------- | ------ | -------- | ----------------------- |
| name      | String | Yes      | User's name            |
| email     | String | Yes      | Valid and unique email |
| password  | String | Yes      | Minimum 6 characters   |

### Optional Parameters

| Parameter | Type   | Description                                                  |
| --------- | ------ | -------------------------------------------------------------- |
| role      | String | `customer` (default) or `professional`. Cannot be `admin`. |

### Response

**201 Created**

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "USER_ID",
    "name": "Test User",
    "email": "testuser@example.com",
    "role": "customer"
  }
}
```

### Notes

New users default to the `customer` role, but may explicitly register as
`professional` (needed to create a professional listing later).

Users can never assign themselves the `admin` role during registration —
this is enforced server-side regardless of what the client sends.

---

## 3.2 Login User

### Endpoint

```text
POST /auth/login
```

### Description

Authenticates an existing user and returns a JWT token.

### Authentication

Not required.

### Request Body

```json
{
  "email": "testuser@example.com",
  "password": "Test@123456"
}
```

### Required Parameters

| Parameter | Type   | Required | Description      |
| --------- | ------ | -------- | ---------------- |
| email     | String | Yes      | Registered email |
| password  | String | Yes      | User password    |

### Response

**200 OK**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "JWT_TOKEN",
  "user": {
    "id": "USER_ID",
    "name": "Test User",
    "email": "testuser@example.com",
    "role": "customer"
  }
}
```

---

# 4. Professional APIs

## 4.1 Get All Professionals

### Endpoint

```text
GET /professionals
```

### Description

Returns all service professionals available in the system.

### Authentication

Not required.

### Response

**200 OK**

```json
{
  "success": true,
  "count": 1,
  "professionals": [
    {
      "_id": "PROFESSIONAL_ID",
      "name": "John Electrician",
      "service": "Electrical",
      "description": "Experienced electrician for home electrical repairs",
      "location": "Bengaluru",
      "rating": 4.5,
      "price": 500,
      "availability": true
    }
  ]
}
```

---

## 4.2 Get Professional by ID

### Endpoint

```text
GET /professionals/:id
```

### Description

Returns a specific professional using their MongoDB ID.

### Authentication

Not required.

### URL Parameter

| Parameter | Type             | Required | Description     |
| --------- | ---------------- | -------- | --------------- |
| id        | MongoDB ObjectId | Yes      | Professional ID |

### Response

**200 OK**

```json
{
  "success": true,
  "professional": {
    "_id": "PROFESSIONAL_ID",
    "name": "John Electrician",
    "service": "Electrical",
    "description": "Experienced electrician",
    "location": "Bengaluru",
    "rating": 4.5,
    "price": 500,
    "availability": true
  }
}
```

### Invalid ID Response

**400 Bad Request**

```json
{
  "success": false,
  "message": "Invalid professional ID"
}
```

---

## 4.3 Create Professional

### Endpoint

```text
POST /professionals
```

### Description

Creates a new service professional listing, owned by the logged-in professional account.

### Authentication

Required. The logged-in user's role must be `professional` or `admin`.
The listing's `user` field is set automatically from the JWT token —
it is not something the client sends.

### Request Header

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

### Request Body

```json
{
  "name": "John Electrician",
  "service": "Electrical",
  "description": "Experienced electrician for home electrical repairs",
  "location": "Bengaluru",
  "rating": 4.5,
  "price": 500,
  "availability": true
}
```

### Required Parameters

| Parameter   | Type   | Required | Description              |
| ----------- | ------ | -------- | ------------------------ |
| name        | String | Yes      | Professional's name      |
| service     | String | Yes      | Service provided         |
| description | String | Yes      | Professional description |
| location    | String | Yes      | Service location         |
| price       | Number | Yes      | Service price            |

### Optional Parameters

| Parameter    | Type    | Description                           |
| ------------ | ------- | ------------------------------------- |
| rating       | Number  | Rating from 0 to 5                    |
| availability | Boolean | Whether the professional is available |

### Response

**201 Created**

```json
{
  "success": true,
  "message": "Professional created successfully",
  "professional": {}
}
```

### Error Responses

**401 Unauthorized** — no or invalid token.
**403 Forbidden** — logged in, but not as a `professional` or `admin`.

---

## 4.4 Update Professional

### Endpoint

```text
PUT /professionals/:id
```

### Description

Updates an existing professional listing.

### Authentication

Required. Only the professional who owns this listing, or an `admin`, may update it.

### Request Header

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

### URL Parameter

| Parameter | Type             | Required |
| --------- | ---------------- | -------- |
| id        | MongoDB ObjectId | Yes      |

### Example Request Body

```json
{
  "price": 600,
  "rating": 4.8
}
```

### Response

**200 OK**

```json
{
  "success": true,
  "message": "Professional updated successfully",
  "professional": {}
}
```

### Error Responses

**403 Forbidden** — logged in, but you don't own this listing (and aren't an admin).

---

## 4.5 Delete Professional

### Endpoint

```text
DELETE /professionals/:id
```

### Description

Deletes an existing professional listing.

### Authentication

Required. Only the professional who owns this listing, or an `admin`, may delete it.

### Request Header

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

### URL Parameter

| Parameter | Type             | Required |
| --------- | ---------------- | -------- |
| id        | MongoDB ObjectId | Yes      |

### Response

**200 OK**

```json
{
  "success": true,
  "message": "Professional deleted successfully"
}
```

### Error Responses

**403 Forbidden** — logged in, but you don't own this listing (and aren't an admin).

---

# 5. Booking APIs

All booking endpoints require JWT authentication.

## 5.1 Create Booking

### Endpoint

```text
POST /bookings
```

### Description

Creates a booking for the authenticated customer.

### Authentication

Required.

### Request Header

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

### Request Body

```json
{
  "professional": "PROFESSIONAL_ID",
  "service": "Electrical",
  "date": "2026-10-05",
  "time": "11:00 AM",
  "status": "pending"
}
```

### Required Parameters

| Parameter    | Type             | Required | Description       |
| ------------ | ---------------- | -------- | ----------------- |
| professional | MongoDB ObjectId | Yes      | Professional ID   |
| service      | String           | Yes      | Requested service |
| date         | String           | Yes      | Booking date      |
| time         | String           | Yes      | Booking time      |

### Optional Parameters

| Parameter | Type   | Description                                 |
| --------- | ------ | ------------------------------------------- |
| status    | String | pending, confirmed, completed, or cancelled |

### Important

The user's ID is automatically taken from the authenticated JWT token.

The client does not need to send a `user` field.

### Response

**201 Created**

```json
{
  "success": true,
  "message": "Booking created successfully",
  "booking": {}
}
```

---

## 5.2 Get My Bookings

### Endpoint

```text
GET /bookings
```

### Description

Returns bookings belonging to the currently authenticated user.

### Authentication

Required.

### Response

**200 OK**

```json
{
  "success": true,
  "count": 1,
  "bookings": []
}
```

---

## 5.3 Get Booking by ID

### Endpoint

```text
GET /bookings/:id
```

### Description

Returns a specific booking belonging to the authenticated user.

### Authentication

Required.

### URL Parameter

| Parameter | Type             | Required |
| --------- | ---------------- | -------- |
| id        | MongoDB ObjectId | Yes      |

### Response

**200 OK**

```json
{
  "success": true,
  "booking": {}
}
```

### Invalid ID Response

**400 Bad Request**

```json
{
  "success": false,
  "message": "Invalid booking ID"
}
```

### Booking Not Found Response

**404 Not Found**

```json
{
  "success": false,
  "message": "Booking not found"
}
```

---

## 5.4 Update Booking

### Endpoint

```text
PUT /bookings/:id
```

### Description

Updates a booking belonging to the authenticated user.

### Authentication

Required.

### URL Parameter

| Parameter | Type             | Required |
| --------- | ---------------- | -------- |
| id        | MongoDB ObjectId | Yes      |

### Example Request Body

```json
{
  "status": "confirmed"
}
```

### Allowed Status Values

```text
pending
confirmed
completed
cancelled
```

### Response

**200 OK**

```json
{
  "success": true,
  "message": "Booking updated successfully",
  "booking": {}
}
```

---

## 5.5 Delete Booking

### Endpoint

```text
DELETE /bookings/:id
```

### Description

Deletes a booking belonging to the authenticated user.

### Authentication

Required.

### URL Parameter

| Parameter | Type             | Required |
| --------- | ---------------- | -------- |
| id        | MongoDB ObjectId | Yes      |

### Response

**200 OK**

```json
{
  "success": true,
  "message": "Booking deleted successfully"
}
```

---

# 6. Health Check

## API Health

### Endpoint

```text
GET /health
```

### Description

Checks whether the FixIt API is running.

### Authentication

Not required.

### Response

**200 OK**

```json
{
  "success": true,
  "message": "FixIt API is healthy"
}
```

---

# 7. Root Endpoint

### Endpoint

```text
GET /
```

### Description

Confirms that the FixIt backend server is running.

### Response

**200 OK**

```json
{
  "success": true,
  "message": "FixIt Backend API is running"
}
```

---

# 8. HTTP Status Codes

| Status Code | Meaning                                          |
| ----------- | ------------------------------------------------ |
| 200         | Request successful                               |
| 201         | Resource created successfully                    |
| 400         | Bad request or validation error                  |
| 401         | Authentication required or invalid/expired token |
| 404         | Resource not found                               |
| 409         | Resource already exists                          |
| 500         | Internal server error                            |

---

# 9. Validation

The API uses `express-validator` for request validation.

Validation is implemented for:

* User registration
* User login
* Professional creation
* Professional updates
* Booking creation
* Booking updates

Examples of validation rules:

* Required fields cannot be empty.
* Email addresses must have a valid format.
* Passwords must contain at least 6 characters.
* Professional price must be a non-negative number.
* Professional rating must be between 0 and 5.
* Booking status must be one of the allowed status values.
* MongoDB IDs must have a valid format.

---

# 10. Authentication and Security

The FixIt backend includes:

* Password hashing using bcryptjs
* JWT-based authentication
* Protected booking endpoints
* User ownership checks for bookings
* Input validation
* MongoDB ObjectId validation
* Environment variables for sensitive configuration
* `.env` excluded from version control
* Users cannot assign themselves an administrator role during registration
* Passwords are not returned in API responses
* Centralized error handling

---

# 11. API Testing

The API was manually tested using the VS Code REST Client extension
(see `test-api.http`), covering:

* User registration (customer and professional roles)
* User login (success, wrong password, unknown email)
* Registration validation and duplicate-email handling
* Role security (self-assigning `admin` is blocked)
* Professional creation, retrieval, update, and deletion
* Professional ownership checks (a professional cannot edit another's listing)
* Booking authentication, creation, retrieval, update, and deletion
* Booking ownership checks (a user cannot see or modify another user's booking)
* Invalid ID handling (both professionals and bookings)
* Request validation errors

In addition, an automated test suite using **Jest** and **Supertest** is
included under `/tests` (`auth.test.js`, `professionals.test.js`,
`bookings.test.js`), covering the same scenarios above against a real
MongoDB test database. Run it with:

```bash
npm test
```

The suite connects to a separate `_test` database (derived from `MONGO_URI`,
or `MONGO_URI_TEST` if set) so it never touches development data, and cleans
up after itself between test files.

---

# 12. Main Endpoint Summary

| Method | Endpoint                 | Authentication                | Purpose                |
| ------ | ------------------------ | ------------------------------ | ----------------------- |
| POST   | `/api/auth/register`     | No                              | Register user           |
| POST   | `/api/auth/login`        | No                              | Login user              |
| GET    | `/api/professionals`     | No                              | Get all professionals   |
| GET    | `/api/professionals/:id` | No                              | Get professional        |
| POST   | `/api/professionals`     | Yes (professional/admin role)  | Create professional     |
| PUT    | `/api/professionals/:id` | Yes (owner or admin)           | Update professional     |
| DELETE | `/api/professionals/:id` | Yes (owner or admin)           | Delete professional     |
| POST   | `/api/bookings`          | Yes                             | Create booking          |
| GET    | `/api/bookings`          | Yes                             | Get user's bookings     |
| GET    | `/api/bookings/:id`      | Yes                             | Get booking             |
| PUT    | `/api/bookings/:id`      | Yes (owner)                    | Update booking          |
| DELETE | `/api/bookings/:id`      | Yes (owner)                    | Delete booking          |
| GET    | `/api/health`            | No                              | Health check            |

---

# 13. Database

The FixIt backend uses MongoDB with Mongoose.

### Main Collections

* `users`
* `professionals`
* `bookings`

### User Fields

* name
* email
* password
* role
* createdAt
* updatedAt

### Professional Fields

* user (reference to the owning User account)
* name
* service
* description
* location
* rating
* price
* availability
* createdAt
* updatedAt

### Booking Fields

* user
* professional
* service
* date
* time
* status
* createdAt
* updatedAt