const express = require("express");

const {
  getProfessionals,
  getProfessionalById,
  createProfessional,
  updateProfessional,
  deleteProfessional,
} = require("../controllers/professionalController");

const {
  handleValidationErrors,
  professionalValidation,
  professionalUpdateValidation,
} = require("../middleware/validationMiddleware");

const { protect, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all professionals — public, so customers can browse without logging in
router.get("/", getProfessionals);

// Get one professional — public
router.get("/:id", getProfessionalById);

// Create a professional listing — must be logged in as a professional (or admin)
router.post(
  "/",
  protect,
  restrictTo("professional", "admin"),
  professionalValidation,
  handleValidationErrors,
  createProfessional
);

// Update a professional — must be logged in; ownership is checked in the controller
router.put(
  "/:id",
  protect,
  professionalUpdateValidation,
  handleValidationErrors,
  updateProfessional
);

// Delete a professional — must be logged in; ownership is checked in the controller
router.delete("/:id", protect, deleteProfessional);

module.exports = router;