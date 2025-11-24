const express = require("express");
const bookingController = require("../Controllers/bookingContoller");
const authController = require("../Controllers/authController");

const router = express.Router({ mergeParams: true });

// Existing routes...
router.get(
  "/exportBookingsReport",
  authController.protect,
  authController.restrictTo("admin"),
  bookingController.exportBookingsReport
);

module.exports = router;
