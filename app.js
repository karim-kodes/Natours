const express = require("express");
const morgan = require("morgan");
const tourRoutes = require("./Routes/tourRoutes");
const userRoutes = require("./Routes/userRoutes");
const AppError = require("./Utils/appError");
// Initialise the app
const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(`${__dirname}/Public`));

// Mount the Routes
app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/users", userRoutes);

// Global Error handling middleware

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!!`, 400));
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.staus = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
