const express = require("express");
const tourRoutes = express.Router();
const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");
const reviewRouter = require("./reviewRoutes");
//ROUTES

tourRoutes.use("/:tourId/reviews", reviewRouter);
// Top 5 cheapest
tourRoutes
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getTours);

tourRoutes.route("/tour-stats").get(tourController.getTourStats);
tourRoutes
  .route("/monthly-plan/:year")
  .get(
    authController.protect,
    authController.restrictTo("admin", "lead-guide", "guide"),
    tourController.getMonthlyPlan
  );

tourRoutes
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(tourController.getToursWithin);

tourRoutes
  .route("/distances/:latlng/unit/:unit")
  .get(tourController.getDistances);

tourRoutes
  .route("/")
  .get(tourController.getTours)
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.createTour
  );

tourRoutes
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

// Nested Routes
//

module.exports = tourRoutes;
