import crypto from 'crypto';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import { generateToken, sendTokenCookie, clearTokenCookie } from '../utils/tokenUtils.js';
import { sendPasswordResetEmail } from './emailService.js';

export const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new AppError('An account with this email already exists.', 400);
  }

  const user = await User.create({ name: name.trim(), email: email.toLowerCase(), password });

  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  return user;
};

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    // Don't reveal whether the email exists
    return;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save({ validateBeforeSave: false });

  await sendPasswordResetEmail(user.email, user.name, resetToken);
};

export const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpires');

  if (!user) {
    throw new AppError('Password reset link is invalid or has expired.', 400);
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return user;
};

export const updatePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new AppError('User not found.', 404);

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new AppError('Current password is incorrect.', 401);

  user.password = newPassword;
  await user.save();

  return user;
};
