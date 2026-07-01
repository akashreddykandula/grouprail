import Member from '../models/Member.js';
import Trip from '../models/Trip.js';
import { AppError } from '../middleware/errorHandler.js';
import { sendSuccess } from '../utils/responseUtils.js';
import { MEMBER_STATUS } from '../config/constants.js';
import { checkTripReadiness } from '../services/tripService.js';

export const getMyMembership = async (req, res, next) => {
  try {
    const member = await Member.findOne({ trip: req.params.tripId, user: req.user._id });
    if (!member) return next(new AppError('You are not a member of this trip.', 404));
    return sendSuccess(res, 200, 'Membership fetched', { member });
  } catch (err) { next(err); }
};

export const updateMembership = async (req, res, next) => {
  try {
    const member = await Member.findOne({ trip: req.params.tripId, user: req.user._id });
    if (!member) return next(new AppError('You are not a member of this trip.', 404));

    const { boardingStation, passengerCount, passengers, notes } = req.body;
    if (boardingStation !== undefined) member.boardingStation = boardingStation;
    if (passengerCount !== undefined) member.passengerCount = passengerCount;
    if (passengers !== undefined) member.passengers = passengers;
    if (notes !== undefined) member.notes = notes;

    // Auto-set ready if all required fields filled
    const isReady = member.boardingStation && member.passengers.length > 0 &&
      member.passengers.every((p) => p.name);
    member.status = isReady ? MEMBER_STATUS.READY : MEMBER_STATUS.PENDING;

    await member.save();

    // Check if all members are ready
    await checkTripReadiness(req.params.tripId);

    const io = req.app.get('io');
    io.to(`trip:${req.params.tripId}`).emit('member_updated', {
      tripId: req.params.tripId,
      memberId: member._id,
      status: member.status,
    });

    return sendSuccess(res, 200, 'Details updated', { member });
  } catch (err) { next(err); }
};

export const markReady = async (req, res, next) => {
  try {
    const member = await Member.findOne({ trip: req.params.tripId, user: req.user._id });
    if (!member) return next(new AppError('Member not found.', 404));
    if (!member.boardingStation || member.passengers.length === 0) {
      return next(new AppError('Please complete your boarding station and passenger details before marking ready.', 400));
    }
    member.status = MEMBER_STATUS.READY;
    await member.save();
    await checkTripReadiness(req.params.tripId);
    const io = req.app.get('io');
    io.to(`trip:${req.params.tripId}`).emit('member_ready', { tripId: req.params.tripId, memberId: member._id });
    return sendSuccess(res, 200, 'Marked as ready', { member });
  } catch (err) { next(err); }
};

export const leaveTrip = async (req, res, next) => {
  try {
    const member = await Member.findOne({ trip: req.params.tripId, user: req.user._id });
    if (!member) return next(new AppError('Member not found.', 404));
    if (member.isOrganizer) return next(new AppError('The organizer cannot leave the trip. Delete the trip instead.', 400));
    await Member.findByIdAndDelete(member._id);
    return sendSuccess(res, 200, 'Left trip successfully');
  } catch (err) { next(err); }
};
