const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Professional = require("../models/Professional");

const getBookings = async (req, res) => {
  try {
    let bookings;

    if (req.user.role === "professional") {
      const professional = await Professional.findOne({
        user: req.user.userId,
      });

      if (!professional) {
        return res.status(200).json({
          success: true,
          count: 0,
          bookings: [],
        });
      }

      bookings = await Booking.find({
        professional: professional._id,
      })
        .populate("user", "name email")
        .populate(
          "professional",
          "name service location price"
        )
        .sort({ createdAt: -1 });
    } else {
      bookings = await Booking.find({
        user: req.user.userId,
      })
        .populate("user", "name email")
        .populate(
          "professional",
          "name service location price"
        )
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

const getBookingById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    let booking;

    if (req.user.role === "professional") {
      const professional = await Professional.findOne({
        user: req.user.userId,
      });

      if (!professional) {
        return res.status(404).json({
          success: false,
          message: "Professional profile not found",
        });
      }

      booking = await Booking.findOne({
        _id: req.params.id,
        professional: professional._id,
      })
        .populate("user", "name email")
        .populate(
          "professional",
          "name service location price"
        );
    } else {
      booking = await Booking.findOne({
        _id: req.params.id,
        user: req.user.userId,
      })
        .populate("user", "name email")
        .populate(
          "professional",
          "name service location price"
        );
    }

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
    console.error("Get booking by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
    });
  }
};

const createBooking = async (req, res) => {
  try {
    const {
      professional,
      service,
      date,
      time,
      status,
      address,
      issue,
    } = req.body;

    const user = req.user.userId;

    if (!professional || !service || !date || !time) {
      return res.status(400).json({
        success: false,
        message:
          "Professional, service, date, and time are required",
      });
    }

    if (!mongoose.isValidObjectId(professional)) {
      return res.status(400).json({
        success: false,
        message: "Invalid professional ID",
      });
    }

    const professionalExists =
      await Professional.findById(professional);

    if (!professionalExists) {
      return res.status(404).json({
        success: false,
        message: "Professional not found",
      });
    }

    if (
      typeof professionalExists.price !== "number" ||
      professionalExists.price < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Professional price is not available",
      });
    }

    const booking = await Booking.create({
      user,
      professional,
      service,
      date,
      time,
      amount: professionalExists.price,
      status: status || "pending",
      address,
      issue,
    });

    const populatedBooking =
      await Booking.findById(booking._id)
        .populate("user", "name email")
        .populate(
          "professional",
          "name service location price"
        );

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create booking",
    });
  }
};

const updateBooking = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    let filter;
    let updateData = {};

    if (req.user.role === "professional") {
      const professional = await Professional.findOne({
        user: req.user.userId,
      });

      if (!professional) {
        return res.status(404).json({
          success: false,
          message: "Professional profile not found",
        });
      }

      filter = {
        _id: req.params.id,
        professional: professional._id,
      };

      if (!req.body.status) {
        return res.status(400).json({
          success: false,
          message: "Booking status is required",
        });
      }

      updateData = {
        status: req.body.status,
      };
    } else if (req.user.role === "customer") {
      filter = {
        _id: req.params.id,
        user: req.user.userId,
      };

      const allowedFields = [
        "date",
        "time",
        "address",
        "issue",
      ];

      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: "No valid booking fields to update",
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update bookings",
      });
    }

    const booking =
      await Booking.findOneAndUpdate(
        filter,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate("user", "name email")
        .populate(
          "professional",
          "name service location price"
        );

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
    console.error("Update booking error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update booking",
    });
  }
};

const deleteBooking = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking =
      await Booking.findOneAndDelete({
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
    console.error("Delete booking error:", error);

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