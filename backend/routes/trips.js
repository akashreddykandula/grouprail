import { Router } from 'express';
import {
  createTrip, getTrip, getMyTrips, joinTrip,
  updateTrip, deleteTrip, getTripByInviteCode,
} from '../controllers/tripController.js';
import { protect } from '../middleware/protect.js';
import { tripValidation } from '../middleware/validation.js';
import { generateRecommendation } from '../services/aiService.js';
import { sendSuccess } from '../utils/responseUtils.js';

const router = Router();
router.use(protect);

router.get('/', getMyTrips);
router.post('/', tripValidation, createTrip);
router.post('/join', joinTrip);
router.get('/invite/:code', getTripByInviteCode);
router.get('/:tripId', getTrip);
router.patch('/:tripId', updateTrip);
router.delete('/:tripId', deleteTrip);

// AI recommendation
router.post('/:tripId/recommend', async (req, res, next) => {
  try {
    const recommendation = await generateRecommendation(req.params.tripId, req.user._id);
    return sendSuccess(res, 200, 'Recommendation generated', { recommendation });
  } catch (err) { next(err); }
});

export default router;
