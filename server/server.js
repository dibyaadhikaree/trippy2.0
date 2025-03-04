const app = require("./app");

const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://dibyaaadhikari:trippytriprecommendation@trippy.beh0s.mongodb.net/",
    {}
  )
  .then(
    () => console.log("Succesfully connected to the DB"),
    (err) => console.log("Couldnt connect", err.message)
  );

app.listen(2000, () => {
  console.log("Server started on port 2000");
});
