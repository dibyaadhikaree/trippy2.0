const fs = require("fs");

const places = JSON.parse(fs.readFileSync("./detailedPlaces.json"));

// Initialize a Set to store unique categories
const uniqueCategories = new Set();

// Iterate through each place to collect categories
places.forEach((place) => {
  if (Array.isArray(place.categories)) {
    place.categories.forEach((category) => uniqueCategories.add(category));
  }
});

// Convert the Set to a sorted array (optional)
const sortedCategories = Array.from(uniqueCategories).sort();

// Display the unique categories
console.log("Unique Categories:", sortedCategories);

const cat = [
  "aquatic_protected_areas",
  "archaeology",
  "architecture",
  "bakeries",
  "biographical_museums",
  "buddhist_temples",
  "castles",
  "cathedrals",
  "caves",
  "cinemas",
  "clock_towers",
  "cultural",
  "destroyed_objects",
  "foods",
  "fortifications",
  "gardens_and_parks",
  "geological_formations",
  "hindu_temples",
  "historic",
  "historic_architecture",
  "historic_object",
  "historic_settlements",
  "historical_places",
  "interesting_places",
  "monasteries",
  "monuments",
  "monuments_and_memorials",
  "mosques",
  "mountain_peaks",
  "museums",
  "national_parks",
  "natural",
  "nature_reserves",
  "nature_reserves_others",
  "observation_towers",
  "other",
  "other_archaeological_sites",
  "other_buildings_and_structures",
  "other_fortifications",
  "other_lakes",
  "other_museums",
  "other_nature_conservation_areas",
  "other_temples",
  "palaces",
  "religion",
  "reservoirs",
  "restaurants",
  "sculptures",
  "shops",
  "squares",
  "theatres_and_entertainments",
  "tourist_facilities",
  "tourist_object",
  "towers",
  "unclassified_objects",
  "urban_environment",
  "view_points",
  "water",
  "waterfalls",
  "wildlife_reserves",
  "zoos",
];
