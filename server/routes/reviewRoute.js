const express = require("express");

const reviewController = require("../controllers/reviewController");

const Router = express.Router({ mergeParams: true }); //in order to get reference routes form /tours/id/reviews beacause review routes must be controlled by a review controller

Router.route("/")
  .get(reviewController.getReviewsForPlace)
  .post(reviewController.createReview);

Router.route("/:id")
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = Router;
