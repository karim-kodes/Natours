const express = require("express");
const morgan = require("morgan");
const tourRoutes = require("./Routes/tourRoutes");
// Initialise the app
const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(`${__dirname}/Public`));

// Mount the Routes

app.use("/api/v1/tours", tourRoutes);
// app.use("/api/v1/tours", tourRoutes);

module.exports = app;
