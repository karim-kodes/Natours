const tourController = require("./../Controllers/tourController");
const express = require("express");

const router = express.Router();

router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour);

module.exports = router;
