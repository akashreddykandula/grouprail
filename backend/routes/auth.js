import { Router } from 'express';
import {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/protect.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  updatePasswordValidation,
} from '../middleware/validation.js';

const router = Router();

router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);
router.post('/logout', logout);
router.post('/forgot-password', authLimiter, forgotPasswordValidation, forgotPassword);
router.post('/reset-password/:token', authLimiter, resetPasswordValidation, resetPassword);
router.get('/me', protect, getMe);
router.patch('/update-password', protect, updatePasswordValidation, updatePassword);

export default router;
