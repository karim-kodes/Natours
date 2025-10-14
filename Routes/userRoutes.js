// routes/userRoutes.js
const express = require("express");
const userController = require("../Controllers/userController");
const authController = require("../Controllers/authController");

const router = express.Router();
router.post("/signup", authController.signUp);
router.post("/login", authController.login);

router.route("/").get(userController.getAllUsers); // GET /api/v1/users

router
  .route("/:id")
  .get(userController.getUser) // GET /api/v1/users/:id
  .patch(userController.updateUser) // PATCH /api/v1/users/:id
  .delete(userController.deleteUser); // DELETE /api/v1/users/:id

module.exports = router;
