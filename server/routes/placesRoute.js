const express = require("express");

const router = express.Router();

const placesController = require("../controllers/placesController");

router.route("/").get(placesController.getAllPlaces);

router.route("/popularPlaces").get(placesController.getPopularPlaces);

router.route("/forYou").post(placesController.getForYou);

router.route("/:id").get(placesController.getPlaceById);

module.exports = router;
