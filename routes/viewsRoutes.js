const express = require("express");
const router = express.Router();
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

router.use(authController.isLoggedIn);

router.get("/", viewsController.getHomePage);
router.get("/login", viewsController.getLogin);
router.get("/signUp", viewsController.getSignUp);
router.get(
  "/admin-dashboard",
  authController.restrictTo("admin"),
  viewsController.getAdminDashboard
);
router.get("/contact-us", viewsController.getContactPage);
router.get("/about-us", viewsController.getAboutPage);
router.get("/tour/:slug", viewsController.getTour);
router.get(
  "/checkout/:tourId",
  authController.protect,
  viewsController.getCheckout
);
router.get("/tours", viewsController.getToursPage);
router.get("/me", viewsController.getMe);

module.exports = router;
