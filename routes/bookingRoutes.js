const express = require("express");
const bookingController = require("../controllers/bookingContoller");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

// Existing routes...
router.get(
  "/exportBookingsReport",
  authController.protect,
  authController.restrictTo("admin"),
  bookingController.exportBookingsReport
);

module.exports = router;
