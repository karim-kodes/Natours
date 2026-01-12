const express = require("express");
const contactController = require("../controllers/contactController.js");

const router = express.Router();

router.post("/contact", contactController.sendContactMessage);

module.exports = router;
