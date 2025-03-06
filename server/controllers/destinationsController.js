const HeadDestination = require("../model/headDestination");
const catchAsync = require("../utils/catchAsyncErrors");

exports.getAllDestinations = catchAsync(async function (req, res, next) {
  const data = await HeadDestination.find();

  res.status(200).json({
    status: "success",
    data,
  });
});

//getAll Destinations

exports.getDestinationById = catchAsync(async function (req, res, next) {
  const { id } = req.params;

  const data = await HeadDestination.findById(id);

  res.status(200).json({
    status: "success",
    data,
  });
});
