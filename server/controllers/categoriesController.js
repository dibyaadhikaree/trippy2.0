const Category = require("../model/CategoryModel");
const catchAsync = require("../utils/catchAsyncErrors");

exports.getCategories = catchAsync(async function (req, res, next) {
  const data = await Category.find();

  res.status(200).json({
    status: "success",
    data,
  });
});
