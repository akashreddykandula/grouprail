import Trip from '../models/Trip.js';
import Member from '../models/Member.js';
import Notification from '../models/Notification.js';
import { AppError } from '../middleware/errorHandler.js';
import { generateInviteCode } from '../utils/inviteCode.js';
import { TRIP_STATUS, MEMBER_STATUS, NOTIFICATION_TYPES } from '../config/constants.js';
import { emitToTrip, emitToUser } from './socketService.js';

export const createTrip = async (organizerId, data) => {
  let inviteCode;
  let attempts = 0;
  // Retry until unique code found (collision extremely rare)
  while (attempts < 5) {
    inviteCode = generateInviteCode();
    const existing = await Trip.findOne({ inviteCode });
    if (!existing) break;
    attempts++;
  }

  const trip = await Trip.create({
    ...data,
    organizer: organizerId,
    inviteCode,
    timeline: [{ event: 'Trip Created', type: 'created', description: `Trip "${data.name}" was created` }],
  });

  // Auto-join organizer as member
  await Member.create({
    trip: trip._id,
    user: organizerId,
    isOrganizer: true,
    status: MEMBER_STATUS.PENDING,
  });

  return trip;
};

export const getTrip = async (tripId, userId) => {
  const trip = await Trip.findById(tripId)
    .populate('organizer', 'name email avatar')
    .populate({
      path: 'members',
      populate: { path: 'user', select: 'name email avatar' },
    });

  if (!trip) throw new AppError('Trip not found.', 404);

  // Check if user is a member
  const isMember = trip.members.some((m) => m.user._id.toString() === userId.toString());
  if (!isMember) throw new AppError('You are not a member of this trip.', 403);

  return trip;
};

export const getUserTrips = async (userId) => {
  const memberDocs = await Member.find({ user: userId })
    .populate({
      path: 'trip',
      populate: { path: 'organizer', select: 'name avatar' },
    })
    .sort({ createdAt: -1 });

  return memberDocs.map((m) => ({ ...m.trip.toObject(), memberRole: m.isOrganizer ? 'organizer' : 'member' }));
};

export const joinTrip = async (inviteCode, userId) => {
  const trip = await Trip.findOne({ inviteCode: inviteCode.toUpperCase() }).populate('organizer', 'name');
  if (!trip) throw new AppError('Invalid invite code. Please check and try again.', 404);
  if (trip.status === TRIP_STATUS.CANCELLED) throw new AppError('This trip has been cancelled.', 400);

  // Check member limit
  const memberCount = await Member.countDocuments({ trip: trip._id });
  if (memberCount >= trip.maxMembers) {
    throw new AppError('This trip has reached its maximum number of members.', 400);
  }

  // Check already a member
  const existing = await Member.findOne({ trip: trip._id, user: userId });
  if (existing) throw new AppError('You are already a member of this trip.', 400);

  const member = await Member.create({
    trip: trip._id,
    user: userId,
    status: MEMBER_STATUS.PENDING,
  });

  // Add timeline event
  await Trip.findByIdAndUpdate(trip._id, {
    $push: { timeline: { event: 'Member Joined', type: 'joined', description: `A new member joined the trip` } },
  });

  return { trip, member };
};

export const updateTrip = async (tripId, userId, updates) => {
  const trip = await Trip.findById(tripId);
  if (!trip) throw new AppError('Trip not found.', 404);
  if (trip.organizer.toString() !== userId.toString()) {
    throw new AppError('Only the trip organizer can update trip details.', 403);
  }

  const allowedFields = ['name', 'destination', 'travelDate', 'trainPreference', 'maxMembers'];
  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) trip[field] = updates[field];
  });

  await trip.save();
  return trip;
};

export const deleteTrip = async (tripId, userId) => {
  const trip = await Trip.findById(tripId);
  if (!trip) throw new AppError('Trip not found.', 404);
  if (trip.organizer.toString() !== userId.toString()) {
    throw new AppError('Only the trip organizer can delete this trip.', 403);
  }
  await Trip.findByIdAndDelete(tripId);
  await Member.deleteMany({ trip: tripId });
};

export const checkTripReadiness = async (tripId) => {
  const members = await Member.find({ trip: tripId });
  const allReady = members.length > 0 && members.every((m) => m.status === MEMBER_STATUS.READY);

  if (allReady) {
    await Trip.findByIdAndUpdate(tripId, { status: TRIP_STATUS.READY });
  }

  return { allReady, totalMembers: members.length, readyCount: members.filter((m) => m.status === MEMBER_STATUS.READY).length };
};
