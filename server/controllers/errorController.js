//error handling middleware

module.exports = (err, req, res, next) => {
  console.log(err, "from err middleware");

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(400).json({
    statusCode: err.statusCode,
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};
