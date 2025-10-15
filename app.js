const express = require("express");
const path = require("path");
const morgan = require("morgan");
const tourRoutes = require("./Routes/tourRoutes");
const userRoutes = require("./Routes/userRoutes");
const viewRouter = require("./Routes/viewsRoutes");
const AppError = require("./utils/appError");
const cookieParser = require("cookie-parser");
// Initialise the app
const app = express();

// Set Pug as the template engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(cookieParser());

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// Mount the Routes
app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/", viewRouter);

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
