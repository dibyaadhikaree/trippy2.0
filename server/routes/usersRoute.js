const express = require("express");

const authController = require("../controllers/authController");

const Router = express.Router();

Router.route("/getUserFromEmail/:email").get(authController.getUserFromEmail);

Router.route("/")
  .get(authController.getAllUsers)
  .post(authController.createUser)
  .patch(authController.setUserPreferences);

module.exports = Router;
