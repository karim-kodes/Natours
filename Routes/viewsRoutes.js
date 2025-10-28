const express = require("express");
const viewsController = require("../Controllers/viewsController");
const authController = require("../Controllers/authController");

const Router = express.Router();

// Run this middleware on every rendered page

console.log("viewsController:", viewsController);
Router.get("/", viewsController.getHomepage);
Router.get("/tours", viewsController.getToursPage);
Router.get("/sign-up", viewsController.getSignup);
Router.get("/sign-in", viewsController.getLogin);

module.exports = Router;
