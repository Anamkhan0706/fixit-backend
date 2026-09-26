const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
};

const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("role")
    .optional()
    .isIn(["customer", "professional"])
    .withMessage("Role must be either customer or professional"),
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];
const professionalValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Professional name is required"),

  body("service")
    .trim()
    .notEmpty()
    .withMessage("Service is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),

  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),

  body("availability")
    .optional()
    .isBoolean()
    .withMessage("Availability must be true or false"),
];
const professionalUpdateValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty"),

  body("service")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Service cannot be empty"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),

  body("location")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Location cannot be empty"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),

  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),

  body("availability")
    .optional()
    .isBoolean()
    .withMessage("Availability must be true or false"),
];

const bookingValidation = [
  body("professional")
    .notEmpty()
    .withMessage("Professional ID is required")
    .isMongoId()
    .withMessage("Professional ID must be valid"),

  body("service")
    .trim()
    .notEmpty()
    .withMessage("Service is required"),

  body("date")
    .trim()
    .notEmpty()
    .withMessage("Date is required"),

  body("time")
    .trim()
    .notEmpty()
    .withMessage("Time is required"),

  body("status")
    .optional()
    .isIn(["pending", "confirmed", "completed", "cancelled"])
    .withMessage(
      "Status must be pending, confirmed, completed, or cancelled"
    ),
];
const bookingUpdateValidation = [
  body("professional")
    .optional()
    .isMongoId()
    .withMessage("Professional ID must be valid"),

  body("service")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Service cannot be empty"),

  body("date")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Date cannot be empty"),

  body("time")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Time cannot be empty"),

  body("status")
    .optional()
    .isIn(["pending", "confirmed", "completed", "cancelled"])
    .withMessage(
      "Status must be pending, confirmed, completed, or cancelled"
    ),
];

module.exports = {
  handleValidationErrors,
  registerValidation,
  loginValidation,
  professionalValidation,
  professionalUpdateValidation,
  bookingValidation,
  bookingUpdateValidation,
};