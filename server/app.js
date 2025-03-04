const express = require("express");

const app = express();

const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

//For parsing the body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Setting up the routers

const destinationsRouter = require("./routes/destinationsRoute");
const placesRouter = require("./routes/placesRoute");
const usersRouter = require("./routes/usersRoute");

app.use("/api/destinations", destinationsRouter);
app.use("/api/places", placesRouter);
app.use("/api/users", usersRouter);

app.get("/", (req, res) => {
  console.log(req.body);

  //   const data = fetch("localhost:2000/ml/");

  res.status(200).send("Hello this is the entry route");
});

module.exports = app;
