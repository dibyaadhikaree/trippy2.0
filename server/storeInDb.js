const mongoose = require("mongoose");

const fs = require("fs");

const HeadDestination = require(".././server/model/headDestination");

const Places = require("../server/model/Places");

mongoose
  .connect(
    "mongodb+srv://dibyaaadhikari:trippytriprecommendation@trippy.beh0s.mongodb.net/",
    {}
  )
  .then(
    () => console.log("Succesfully connected to the DB"),
    (err) => console.log("Couldnt connect", err.message)
  );

const headDestination = JSON.parse(fs.readFileSync("./headDestinations.json"));

const saveHeadDestinationDb = async function () {
  const data = await HeadDestination.insertMany(headDestination);

  console.log("Data stored sucessfully ", data);
};

const detailedPlaces = fs.readFileSync("./detailedPlaces.json", "utf-8");
const savePlacesDb = async function () {
  const data = await Places.insertMany(JSON.parse(detailedPlaces));

  console.log("Sucessfully saved to db ", data);
};

savePlacesDb();

// saveHeadDestinationDb();

//get places from headDestination and save to places model
