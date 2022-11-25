module.exports = (err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message,
    stack: err.stack,
  });
};
