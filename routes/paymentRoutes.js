const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authController = require("../controllers/authController");

// Initiate payment (protected - user must be logged in)
router.post(
  "/pay/:tourId",
  authController.protect,
  paymentController.initiatePayment
);

// Handle payment success (protected - user must be logged in)
router.get(
  "/me",
  authController.protect,
  paymentController.handlePaymentSuccess
);

// Webhook from Paystack (NOT protected - Paystack sends this)
router.post("/webhook", paymentController.handleWebhook);

module.exports = router;
