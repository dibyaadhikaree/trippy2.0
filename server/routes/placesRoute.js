const express = require("express");

const router = express.Router();

const placesController = require("../controllers/placesController");

const reviewRouter = require("../routes/reviewRoute");

router.use("/:placeId/reviews", reviewRouter); //Merging params , i.e a request for /reviews or /tourId/reviews will be passed to the reviewRouter

router.route("/").get(placesController.getAllPlaces);

router.route("/popularPlaces").get(placesController.getPopularPlaces);

router.route("/forYou").post(placesController.getForYou);
router.route("/likedPlaces/:userId").get(placesController.getLikedPlaces);

router.route("/:id").get(placesController.getPlaceById);

module.exports = router;
