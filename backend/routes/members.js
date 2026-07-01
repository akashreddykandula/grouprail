import { Router } from 'express';
import { getMyMembership, updateMembership, markReady, leaveTrip } from '../controllers/memberController.js';
import { protect } from '../middleware/protect.js';

const router = Router({ mergeParams: true });
router.use(protect);

router.get('/trips/:tripId/membership', getMyMembership);
router.patch('/trips/:tripId/membership', updateMembership);
router.post('/trips/:tripId/ready', markReady);
router.delete('/trips/:tripId/leave', leaveTrip);

export default router;
