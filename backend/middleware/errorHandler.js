export function errorHandler(err, req, res, next) {
  console.error("❌ Backend Error Handler:", err.stack || err.message);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errorCode: err.name || "SERVER_ERROR"
  });
}
