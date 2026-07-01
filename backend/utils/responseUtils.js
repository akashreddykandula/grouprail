export const sendSuccess = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    ...data,
  });
};

export const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    status: 'fail',
    message,
  });
};

export const paginate = (query, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};
