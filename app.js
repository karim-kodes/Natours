const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./Controllers/errorController");
const qs = require("qs");
const tourRoutes = require("./routes/tourRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const app = express();

app.set("query parser", (str) => qs.parse(str));

// GLOBAL MIDDLEWARES
// console.log(process.env.NODE_ENV);
// SET security http headers
app.use(helmet());

// development login
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hour",
});

app.use("/api", limiter);

// body parser, reading data from the body into  req.body
app.use(express.json({ limit: "10kb" }));

// Data sanitation against NoSQL query injections
app.use(mongoSanitize());
// Data sanitization against XSS attacks
app.use(xss());

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);
// Serving static files
app.use(express.static(`${__dirname}/public`));

// test middleware
app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// ROUTES

app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/reviews", reviewRoutes);

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware

app.use(globalErrorHandler);
module.exports = app;
