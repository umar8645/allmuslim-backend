export const errorHandler = (err, req, res, next) => {
  // ✅ Log error stack in development
  if (process.env.NODE_ENV === "development") {
    console.error("❌ Error stack:", err.stack);
  }

  // ✅ Set status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // ✅ Send structured JSON response
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || "Server Error",
      // Show stack trace only in development
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      // Optional: add request info for debugging
      path: req.originalUrl,
      method: req.method
    }
  });
};
