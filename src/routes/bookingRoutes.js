const express = require("express");
const protect = require("../middleware/authMiddleware").protect;

const {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");

const {
  handleValidationErrors,
  bookingValidation,
  bookingUpdateValidation,
} = require("../middleware/validationMiddleware");

const router = express.Router();

// Get all bookings
router.get("/", protect, getBookings);

// Get one booking
router.get("/:id", protect, getBookingById);

// Create a booking
router.post(
  "/",
  protect,
  bookingValidation,
  handleValidationErrors,
  createBooking
);

// Update a booking
router.put(
  "/:id",
  protect,
  bookingUpdateValidation,
  handleValidationErrors,
  updateBooking
);

// Delete a booking
router.delete("/:id", protect, deleteBooking);

module.exports = router;