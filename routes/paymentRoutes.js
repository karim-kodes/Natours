const express = require("express");
const router = express.Router();
const paymentController = require("../Controllers/paymentController");

router.post("/pay", paymentController.initiatePayment);
router.post("/webhook", paymentController.handleWebhook);

module.exports = router;
