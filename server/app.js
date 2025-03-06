const express = require("express");

const app = express();

const cors = require("cors");

const AppError = require("./utils/AppError");
const errorHandlingMiddleware = require("./controllers/errorController");

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
const reviewRouter = require("./routes/reviewRoute");

app.use("/api/destinations", destinationsRouter);
app.use("/api/places", placesRouter);
app.use("/api/users", usersRouter);
app.use("/api/reviews", reviewRouter);

app.get("/", (req, res) => {
  console.log(req.body);

  //   const data = fetch("localhost:2000/ml/");

  res.status(200).send("Hello this is the entry route");
});

app.all("*", (req, res, next) => {
  const err = new AppError(`No route found for ${req.originalUrl}`, 500);
  next(err);
});

app.use(errorHandlingMiddleware);

module.exports = app;
