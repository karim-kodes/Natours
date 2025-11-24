const express = require("express");
const path = require("path");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const qs = require("qs");
const tourRoutes = require("./routes/tourRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const viewsRoutes = require("./routes/viewsRoutes");
const app = express();

app.set("query parser", (str) => qs.parse(str));

// GLOBAL MIDDLEWARES
// console.log(process.env.NODE_ENV);
// SET security http headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://unpkg.com",
          "https://maps.googleapis.com",
          "https://maps.gstatic.com",
        ],
        scriptSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://unpkg.com",
          "https://maps.googleapis.com",
          "https://maps.gstatic.com",
          "'unsafe-inline'",
        ],
        styleSrc: [
          "'self'",
          "https://fonts.googleapis.com",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "https://unpkg.com",
          "https://maps.googleapis.com",
          "'unsafe-inline'",
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "https://cdnjs.cloudflare.com",
          "data:",
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https:",
          "https://maps.gstatic.com",
          "https://maps.googleapis.com",
        ],
        frameSrc: [
          "'self'",
          "https://www.google.com",
          "https://maps.googleapis.com",
        ],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

console.log("✅ Middleware stack loaded — before routes");
app.use((req, res, next) => {
  console.log("➡️ Received request:", req.method, req.url);
  next();
});

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
app.use(cookieParser());

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
// 1. Set Pug as the view engine
app.set("view engine", "pug");
// 2. Set the views directory
app.set("views", path.join(__dirname, "views"));
// 3. Serve static files (optional, but common)
app.use(express.static(path.join(__dirname, "public")));

// test middleware
app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

// ROUTES
app.use("/", viewsRoutes);
app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

// app.get("/test", (req, res) => {
//   res.send("✅ Server is responding!");
// });

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware

app.use(globalErrorHandler);
module.exports = app;
