import mongoose from 'mongoose';
import { MEMBER_STATUS, SEAT_TYPES } from '../config/constants.js';

const passengerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Passenger name is required'],
    trim: true,
  },
  age: {
    type: Number,
    min: [1, 'Age must be at least 1'],
    max: [120, 'Age must be less than 120'],
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    default: 'prefer_not_to_say',
  },
  seatPreferences: {
    type: [String],
    enum: SEAT_TYPES,
    default: [],
  },
});

const memberSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    boardingStation: {
      type: String,
      trim: true,
      default: '',
    },
    passengerCount: {
      type: Number,
      min: [1, 'Must have at least 1 passenger'],
      max: [10, 'Cannot have more than 10 passengers per member'],
      default: 1,
    },
    passengers: [passengerSchema],
    status: {
      type: String,
      enum: Object.values(MEMBER_STATUS),
      default: MEMBER_STATUS.PENDING,
    },
    isOrganizer: {
      type: Boolean,
      default: false,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Prevent duplicate member entries
memberSchema.index({ trip: 1, user: 1 }, { unique: true });

const Member = mongoose.model('Member', memberSchema);
export default Member;
