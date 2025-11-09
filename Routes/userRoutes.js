const express = require("express");
const userRoutes = express.Router();
const userController = require("../Controllers/userController");
const authController = require("./../Controllers/authController");
//ROUTES

userRoutes.post("/signup", authController.signUp);
userRoutes.post("/login", authController.login);
userRoutes.get("/logout", authController.logOut);
userRoutes.post("/forgotpassword", authController.forgotPassword);
userRoutes.patch("/resetpassword/:token", authController.resetPassword);

// Proctect Routes
userRoutes.use(authController.protect);

userRoutes.patch("/updateMyPassword", authController.updatePassword);
userRoutes.get("/me", userController.getMe, userController.getUser);
userRoutes.patch("/updateMe", userController.updateMe);
userRoutes.delete("/deleteMe", userController.deleteMe);

userRoutes.use(authController.protect);
userRoutes.use(authController.restrictTo("admin"));

userRoutes
  .route("/")
  .get(authController.restrictTo("admin"), userController.getAllUsers)
  .post(userController.createUser);

userRoutes
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRoutes;
