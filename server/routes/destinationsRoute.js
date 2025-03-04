const express = require("express");

const Router = express.Router();

const destinationsController = require("../controllers/destinationsController");

Router.route("/").get(destinationsController.getAllDestinations);
Router.route("/:id").get(destinationsController.getDestinationById);

module.exports = Router;
