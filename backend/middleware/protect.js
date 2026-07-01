import { verifyToken } from '../utils/tokenUtils.js';
import { AppError } from './errorHandler.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please sign in to continue.', 401));
    }

    // Verify token
    const decoded = verifyToken(token);

    // Check user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('The account associated with this session no longer exists.', 401));
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};
