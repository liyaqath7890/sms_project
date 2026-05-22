export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error('Global error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
