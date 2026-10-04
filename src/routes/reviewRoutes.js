const express = require("express");

const {
  createReview,
  getProfessionalReviews,
} = require("../controllers/reviewController");

const {
  handleValidationErrors,
  reviewValidation,
} = require("../middleware/validationMiddleware");

const {
  protect,
  restrictTo,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Customer submits a review
router.post(
  "/",
  protect,
  restrictTo("customer"),
  reviewValidation,
  handleValidationErrors,
  createReview
);

// Anyone logged in can view reviews for a professional
router.get(
  "/professional/:professionalId",
  protect,
  getProfessionalReviews
);

module.exports = router;