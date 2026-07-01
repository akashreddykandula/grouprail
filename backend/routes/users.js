import { Router } from 'express';
import { protect } from '../middleware/protect.js';
import User from '../models/User.js';
import { sendSuccess } from '../utils/responseUtils.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();
router.use(protect);

router.get('/profile', async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return next(new AppError('User not found.', 404));
    return sendSuccess(res, 200, 'Profile fetched', { user });
  } catch (err) { next(err); }
});

router.patch('/profile', async (req, res, next) => {
  try {
    const allowed = ['name', 'phone', 'avatar'];
    const updates = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    return sendSuccess(res, 200, 'Profile updated', { user });
  } catch (err) { next(err); }
});

export default router;
