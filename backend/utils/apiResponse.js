export const sendSuccess = (res, data = {}, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    ...data
  });
};

export const sendError = (res, error, fallbackMessage = 'Request failed') => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: error.message || fallbackMessage
  });
};

export const createHttpError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};
