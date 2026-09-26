const express = require("express");

const {
  register,
  login,
} = require("../controllers/authController");

const {
  handleValidationErrors,
  registerValidation,
  loginValidation,
} = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
  "/register",
  registerValidation,
  handleValidationErrors,
  register
);

router.post(
  "/login",
  loginValidation,
  handleValidationErrors,
  login
);

module.exports = router;