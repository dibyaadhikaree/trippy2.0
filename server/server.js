const app = require("./app");

const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://dibyaadhikaree:trippyforwin@cluster0.xsvec.mongodb.net/",
    {}
  )
  .then(
    () => console.log("Succesfully connected to the DB"),
    (err) => console.log("Couldnt connect", err.message)
  );

app.listen(2000, () => {
  console.log("Server started on port 2000");
});
