import { validationResult } from 'express-validator';
import * as tripService from '../services/tripService.js';
import { sendSuccess } from '../utils/responseUtils.js';
import { AppError } from '../middleware/errorHandler.js';

export const createTrip = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new AppError(errors.array()[0].msg, 400));

    const trip = await tripService.createTrip(req.user._id, req.body);
    return sendSuccess(res, 201, 'Trip created successfully', { trip });
  } catch (err) { next(err); }
};

export const getTrip = async (req, res, next) => {
  try {
    const trip = await tripService.getTrip(req.params.tripId, req.user._id);
    return sendSuccess(res, 200, 'Trip fetched', { trip });
  } catch (err) { next(err); }
};

export const getMyTrips = async (req, res, next) => {
  try {
    const trips = await tripService.getUserTrips(req.user._id);
    return sendSuccess(res, 200, 'Trips fetched', { trips });
  } catch (err) { next(err); }
};

export const joinTrip = async (req, res, next) => {
  try {
    const { inviteCode } = req.body;
    if (!inviteCode) return next(new AppError('Invite code is required.', 400));
    const result = await tripService.joinTrip(inviteCode, req.user._id);

    // Emit real-time event to trip room
    const io = req.app.get('io');
    io.to(`trip:${result.trip._id}`).emit('member_joined', {
      tripId: result.trip._id,
      user: { _id: req.user._id, name: req.user.name },
    });

    return sendSuccess(res, 200, 'Joined trip successfully', { trip: result.trip });
  } catch (err) { next(err); }
};

export const updateTrip = async (req, res, next) => {
  try {
    const trip = await tripService.updateTrip(req.params.tripId, req.user._id, req.body);
    const io = req.app.get('io');
    io.to(`trip:${trip._id}`).emit('trip_updated', { trip });
    return sendSuccess(res, 200, 'Trip updated', { trip });
  } catch (err) { next(err); }
};

export const deleteTrip = async (req, res, next) => {
  try {
    await tripService.deleteTrip(req.params.tripId, req.user._id);
    return sendSuccess(res, 200, 'Trip deleted successfully');
  } catch (err) { next(err); }
};

export const getTripByInviteCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const Trip = (await import('../models/Trip.js')).default;
    const trip = await Trip.findOne({ inviteCode: code.toUpperCase() })
      .populate('organizer', 'name avatar')
      .select('name destination travelDate maxMembers status organizer inviteCode');
    if (!trip) return next(new AppError('Invalid invite code.', 404));
    return sendSuccess(res, 200, 'Trip found', { trip });
  } catch (err) { next(err); }
};
