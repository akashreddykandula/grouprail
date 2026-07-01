import { Router } from 'express';
import { protect } from '../middleware/protect.js';
import Notification from '../models/Notification.js';
import { sendSuccess } from '../utils/responseUtils.js';

const router = Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 }).limit(50);
    return sendSuccess(res, 200, 'Notifications fetched', { notifications });
  } catch (err) { next(err); }
});

router.patch('/:id/read', async (req, res, next) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true }
    );
    return sendSuccess(res, 200, 'Marked as read');
  } catch (err) { next(err); }
});

router.patch('/read-all', async (req, res, next) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
    return sendSuccess(res, 200, 'All notifications marked as read');
  } catch (err) { next(err); }
});

export default router;
