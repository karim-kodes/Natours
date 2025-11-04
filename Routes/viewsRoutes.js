const express = require("express");
const router = express.Router();
const viewsController = require("../Controllers/viewsController");
const authController = require("../Controllers/authController");

router.use(authController.isLoggedIn);
router.get("/", viewsController.getHomePage);
router.get("/login", viewsController.getLogin);
router.get("/signUp", viewsController.getSignUp);
router.get("/adminDashboard", viewsController.getAdminPage);
router.get("/contact-us", viewsController.getContactPage);
router.get("/about-us", viewsController.getAboutPage);
router.get("/tour/:slug", viewsController.getTour);
router.get("/tours", viewsController.getToursPage);

module.exports = router;
