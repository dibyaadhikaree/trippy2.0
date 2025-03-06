const Review = require("../model/ReviewModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsyncErrors");

//Set user ids or tour ids if it is coming from a merged param :check review routes for more
//i.e if /api/v1/tours/terqwdr143925u/reveiws : we want to get reveiw for tour with given id  ,
//or elser we can get/set  a review from /api/v1/reviews
exports.setTourUserIds = (req, res, next) => {
  //Allow nested routes
  //Data is saved to req.body because  a review requires a tour and user compulsarily
  //so while creating a review this middleware is used first
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  //this stil allows the api to pass user and tour data into body
  //.i.e while posting the review req.body should look like { review : .. , rating :... , tour: .. , user :..  }
  next();
};

exports.createReview = catchAsync(async (req, res, next) => {
  const { placeId } = req.params;
  const newReview = await Review.create({ ...req.body, place: placeId });
  res.status(201).json({
    status: "success",
    data: newReview,
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new AppError("No review found with that ID"));
  }
  res.status(200).json({
    status: "success",
    data: review,
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!review) {
    return next(new Error("No review found with that ID"));
  }
  res.status(200).json({
    status: "success",
    data: review,
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) {
    return next(new Error("No review found with that ID"));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: reviews,
  });
});

exports.getReviewsForPlace = catchAsync(async (req, res, next) => {
  console.log(req.params.length, "req.paaramsss ");

  if (!req.params.length) {
    console.log("here");
    const reviews = await Review.find();
    return res.status(200).json({
      status: "success",
      results: reviews.length,
      data: reviews,
    });
  }

  const { placeId } = req.params; // Extracting placeId from route parameters

  const reviews = await Review.find({ place: placeId });

  if (!reviews.length) {
    return next(new AppError("No reviews found for this place"));
  }

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: reviews,
  });
});
