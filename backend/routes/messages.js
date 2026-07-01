import { Router } from 'express';
import { protect } from '../middleware/protect.js';
import Message from '../models/Message.js';
import { sendSuccess } from '../utils/responseUtils.js';
import { AppError } from '../middleware/errorHandler.js';
import Member from '../models/Member.js';

const router = Router();
router.use(protect);

router.get('/trips/:tripId/messages', async (req, res, next) => {
  try {
    const isMember = await Member.findOne({ trip: req.params.tripId, user: req.user._id });
    if (!isMember) return next(new AppError('Access denied.', 403));
    const messages = await Message.find({ trip: req.params.tripId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 })
      .limit(100);
    return sendSuccess(res, 200, 'Messages fetched', { messages });
  } catch (err) { next(err); }
});

router.post('/trips/:tripId/messages', async (req, res, next) => {
  try {
    const isMember = await Member.findOne({ trip: req.params.tripId, user: req.user._id });
    if (!isMember) return next(new AppError('Access denied.', 403));
    if (!req.body.content?.trim()) return next(new AppError('Message content is required.', 400));

    const message = await Message.create({
      trip: req.params.tripId,
      sender: req.user._id,
      content: req.body.content.trim(),
    });
    const populated = await message.populate('sender', 'name avatar');

    const io = req.app.get('io');
    io.to(`trip:${req.params.tripId}`).emit('receive_message', populated);

    return sendSuccess(res, 201, 'Message sent', { message: populated });
  } catch (err) { next(err); }
});

export default router;
