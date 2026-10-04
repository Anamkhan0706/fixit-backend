const mongoose = require("mongoose");

const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Professional = require("../models/Professional");

const createReview = async (req, res) => {
  try {
    const { booking, rating, comment } = req.body;

    if (!mongoose.isValidObjectId(booking)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const existingReview = await Review.findOne({
      booking,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this booking",
      });
    }

    const bookingData = await Booking.findOne({
      _id: booking,
      user: req.user.userId,
    });

    if (!bookingData) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (bookingData.status !== "completed") {
      return res.status(400).json({
        success: false,
        message:
          "You can only review a completed booking",
      });
    }

    const review = await Review.create({
      booking: bookingData._id,
      customer: req.user.userId,
      professional: bookingData.professional,
      rating,
      comment,
    });

    const professional =
      await Professional.findById(
        bookingData.professional
      );

    if (professional) {
      const reviews = await Review.find({
        professional: professional._id,
      });

      const totalRating = reviews.reduce(
        (sum, reviewItem) =>
          sum + reviewItem.rating,
        0
      );

      professional.rating =
        totalRating / reviews.length;

      await professional.save();
    }

    const populatedReview =
      await Review.findById(review._id)
        .populate(
          "customer",
          "name email"
        )
        .populate(
          "professional",
          "name service"
        )
        .populate("booking");

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review: populatedReview,
    });
  } catch (error) {
    console.error(
      "Create review error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to submit review",
    });
  }
};

const getProfessionalReviews = async (
  req,
  res
) => {
  try {
    if (
      !mongoose.isValidObjectId(
        req.params.professionalId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid professional ID",
      });
    }

    const reviews = await Review.find({
      professional:
        req.params.professionalId,
    })
      .populate("customer", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error(
      "Get professional reviews error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

module.exports = {
  createReview,
  getProfessionalReviews,
};