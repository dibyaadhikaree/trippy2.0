const catchAsync = require("../utils/catchAsyncErrors");
const Places = require("../model/Places");
const User = require("../model/UsersModel");

// exports.getAllPlaces = catchAsync(async (req, res, next) => {
//   //Add filters on getAllPlaces

//   const data = await Places.find().populate("reviews");

//   res.status(200).json({
//     status: "success",
//     data,
//   });
// });

exports.getAllPlaces = catchAsync(async (req, res, next) => {
  //Add filters on getAllPlaces

  const { city, preferences: categories } = req.query;

  // Convert query parameters to arrays if they exist
  // const cityArray = cities ? cities.split(",") : [];

  const categoryArray =
    categories != null && categories ? categories.split(",") : [];

  // Build the aggregation pipeline
  const pipeline = [];

  // Filter by cities if provided
  if (city) {
    pipeline.push({ $match: { city: { $in: [city] } } });
  }

  // Filter by categories if provided
  if (categoryArray.length > 0) {
    pipeline.push({ $match: { categories: { $in: categoryArray } } });
  }

  // Populate reviews
  pipeline.push({
    $lookup: {
      from: "reviews",
      localField: "_id",
      foreignField: "place",
      as: "reviews",
    },
  });

  // Execute the aggregation pipeline
  const data = await Places.aggregate(pipeline);

  res.status(200).json({
    status: "success",
    data,
  });
});

exports.getPlaceById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const data = await Places.findById(id);

  res.status(200).json({
    status: "success",
    data,
  });
});

exports.getPopularPlaces = catchAsync(async (req, res, next) => {
  //fetch popular places from the model

  const response = await fetch("http://127.0.0.1:5000/popular", {
    method: "GET",
  });

  const { popular } = await response.json();

  const popularPlaces = await Places.find({
    _id: { $in: popular },
  });

  res.status(200).json({
    status: "success",
    data: popularPlaces,
  });
});

exports.getForYou = catchAsync(async (req, res, next) => {
  console.log(req.body);

  const response = await fetch("http://localhost:5000/recommend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req.body),
  });

  // Parse the JSON response
  const data = await response.json();

  const forYouPlaces = await Places.find({
    _id: { $in: data.recommendations },
  });

  res.status(200).json({
    status: "success",
    data: forYouPlaces,
  });
});

exports.getLikedPlaces = catchAsync(async (req, res, next) => {
  //fetch popular places from the model

  const { userId } = req.params;

  const user = await User.findById(userId);

  const liked = await Places.find({
    _id: { $in: user.likedPlaces },
  });

  res.status(200).json({
    status: "success",
    data: liked,
  });
});

exports.createPlace = catchAsync(async (req, res, next) => {
  const place = req.body;

  const data = await Places.create(place);

  res.status(200).json({
    status: "success",
    data,
  });
});
