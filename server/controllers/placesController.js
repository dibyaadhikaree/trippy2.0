const Places = require("../model/Places");

exports.getAllPlaces = async (req, res, next) => {
  //Add filters on getAllPlaces

  const data = await Places.find();

  res.status(200).json({
    status: "success",
    data,
  });
};

exports.getPlaceById = async (req, res, next) => {
  const { id } = req.params;

  const data = await Places.findById(id);

  res.status(200).json({
    status: "success",
    data,
  });
};

exports.getPopularPlaces = async (req, res, next) => {
  //fetch popular places from the model

  const response = await fetch("http://127.0.0.1:5000/popular", {
    method: "GET",
  });

  const { popular_places } = await response.json();

  const popularPlaces = await Places.find({
    _id: { $in: popular_places },
  });

  res.status(200).json({
    status: "success",
    data: popularPlaces,
  });
};

exports.getForYou = async (req, res, next) => {
  console.log(req.body);

  // const userData = {
  //   preferences: req.body.preferences,
  // };

  const userData = {
    preferences: req.body.preference,
  };

  const categoryList = {
    "Historical and Cultural Sites": [
      "archaeology",
      "architecture",
      "biographical_museums",
      "castles",
      "cathedrals",
      "historic_architecture",
      "historic_settlements",
      "historical_places",
      "monasteries",
      "monuments_and_memorials",
      "museums",
      "palaces",
      "sculptures",
    ],
    "Religious Sites": [
      "buddhist_temples",
      "hindu_temples",
      "mosques",
      "other_temples",
      "religion",
    ],
    "Natural Attractions": [
      "aquatic_protected_areas",
      "caves",
      "geological_formations",
      "mountain_peaks",
      "national_parks",
      "nature_reserves",
      "waterfalls",
      "wildlife_reserves",
      "zoos",
    ],
    "Parks and Gardens": ["gardens_and_parks", "urban_environment"],
    "Entertainment and Leisure": [
      "cinemas",
      "theatres_and_entertainments",
      "tourist_facilities",
    ],
    "Food and Shopping": ["bakeries", "foods", "restaurants", "shops"],
    "Landmarks and Viewpoints": [
      "clock_towers",
      "observation_towers",
      "squares",
      "towers",
      "view_points",
    ],
  };

  // Initialize an array to hold the subcategories
  let userPreferences = [];

  // Iterate over the user's selected main categories
  userData.preferences.forEach((category) => {
    // Check if the category exists in the mapping
    if (categoryList[category]) {
      // Add the subcategories to the userPreferences array
      userPreferences = userPreferences.concat(categoryList[category]);
    }
  });

  const requestBody = {
    user_preferences: userPreferences,
  };

  // Send the POST request to the Python backend
  const response = await fetch("http://localhost:5000/recommend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
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
};

exports.createPlace = async (req, res, next) => {
  const place = req.body;

  const data = await Places.create(place);

  res.status(200).json({
    status: "success",
    data,
  });
};
