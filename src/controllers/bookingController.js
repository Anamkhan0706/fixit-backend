const mongoose = require("mongoose");
const Booking = require("../models/Booking");

// Get all bookings for the logged-in user
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .populate("user", "name email")
      .populate("professional", "name service location");

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

// Get one booking by ID
const getBookingById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.userId,
    })
      .populate("user", "name email")
      .populate("professional", "name service location");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
    });
  }
};

// Create a booking
const createBooking = async (req, res) => {
  try {
    const {
      professional,
      service,
      date,
      time,
      status,
    } = req.body;

    // User comes from the JWT token
    const user = req.user.userId;

    if (!professional || !service || !date || !time) {
      return res.status(400).json({
        success: false,
        message:
          "Professional, service, date, and time are required",
      });
    }

    const booking = await Booking.create({
      user,
      professional,
      service,
      date,
      time,
      status,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("user", "name email")
      .populate("professional", "name service location");

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
    });
  }
};

// Update a booking
const updateBooking = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("user", "name email")
      .populate("professional", "name service location");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update booking",
    });
  }
};

// Delete a booking
const deleteBooking = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete booking",
    });
  }
};

module.exports = {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
};