const express = require("express");
const userController = require("../Controllers/userController");
const authController = require("../Controllers/authController");

const Router = express.Router();

// AUTHENTICATION ROUTES
Router.route("/sign-up").post(authController.signUp);

// ADMIN ROUTES
Router.route("/").get(userController.getAllUsers);
Router.route("/:id").get(userController.getUser);

module.exports = Router;
