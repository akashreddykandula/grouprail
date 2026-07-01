import { validationResult } from 'express-validator';
import * as authService from '../services/authService.js';
import { generateToken, sendTokenCookie, clearTokenCookie } from '../utils/tokenUtils.js';
import { sendSuccess } from '../utils/responseUtils.js';
import { AppError } from '../middleware/errorHandler.js';

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  avatar: user.avatar,
  createdAt: user.createdAt,
  lastLogin: user.lastLogin,
});

export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }

    const { name, email, password } = req.body;
    const user = await authService.registerUser({ name, email, password });
    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    // Fire-and-forget welcome email
    import('../services/emailService.js').then(({ sendWelcomeEmail }) => {
      sendWelcomeEmail(user.email, user.name).catch(() => {});
    });

    return sendSuccess(res, 201, 'Account created successfully', {
      user: formatUser(user),
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }

    const { email, password } = req.body;
    const user = await authService.loginUser({ email, password });
    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    return sendSuccess(res, 200, 'Logged in successfully', {
      user: formatUser(user),
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    clearTokenCookie(res);
    return sendSuccess(res, 200, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, 200, 'User fetched', {
      user: formatUser(req.user),
    });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }

    const { email } = req.body;
    await authService.forgotPassword(email);

    // Always send a success response to prevent email enumeration
    return sendSuccess(
      res,
      200,
      'If an account exists with that email, a password reset link has been sent.'
    );
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }

    const { token } = req.params;
    const { password } = req.body;
    const user = await authService.resetPassword(token, password);
    const jwtToken = generateToken(user._id);
    sendTokenCookie(res, jwtToken);

    return sendSuccess(res, 200, 'Password reset successfully', {
      user: formatUser(user),
    });
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }

    const { currentPassword, newPassword } = req.body;
    const user = await authService.updatePassword(req.user._id, currentPassword, newPassword);
    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    return sendSuccess(res, 200, 'Password updated successfully');
  } catch (err) {
    next(err);
  }
};
