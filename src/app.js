const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const professionalRoutes = require("./routes/professionalRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const errorHandler = require("./middleware/errorMiddleware");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/professionals", professionalRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "FixIt API is running",
  });
});

app.use(errorHandler);

module.exports = app;