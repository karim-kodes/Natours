const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/pay", paymentController.initiatePayment);
router.post("/webhook", paymentController.handleWebhook);

module.exports = router;
