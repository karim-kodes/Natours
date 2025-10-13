const express = require("express");
const viewsController = require("../Controllers/viewsController");

const Router = express.Router();

console.log("viewsController:", viewsController);

Router.get("/sign-up", viewsController.getSignup);
Router.get("/sign-in", viewsController.getLogin);

module.exports = Router;
