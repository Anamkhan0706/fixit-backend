const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const professionalRoutes = require("./routes/professionalRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const app = express();
const errorHandler = require("./middleware/errorMiddleware");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FixIt Backend API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "FixIt API is healthy",
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/professionals", professionalRoutes);
app.use("/api/bookings", bookingRoutes);
app.use(errorHandler);
module.exports = app;