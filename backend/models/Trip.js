import mongoose from 'mongoose';
import { TRIP_STATUS } from '../config/constants.js';

const tripSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Trip name is required'],
      trim: true,
      minlength: [3, 'Trip name must be at least 3 characters'],
      maxlength: [100, 'Trip name cannot exceed 100 characters'],
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    travelDate: {
      type: Date,
      required: [true, 'Travel date is required'],
      validate: {
        validator: function (v) {
          return v > new Date();
        },
        message: 'Travel date must be in the future',
      },
    },
    trainPreference: {
      type: String,
      default: '',
      trim: true,
    },
    maxMembers: {
      type: Number,
      required: [true, 'Maximum members is required'],
      min: [2, 'Trip must allow at least 2 members'],
      max: [50, 'Trip cannot exceed 50 members'],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    inviteCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    status: {
      type: String,
      enum: Object.values(TRIP_STATUS),
      default: TRIP_STATUS.PLANNING,
    },
    aiRecommendation: {
      summary: { type: String, default: '' },
      recommendedStation: { type: String, default: '' },
      advantages: [{ type: String }],
      tradeoffs: [{ type: String }],
      generatedAt: { type: Date },
    },
    timeline: [
      {
        event: { type: String, required: true },
        description: { type: String, default: '' },
        timestamp: { type: Date, default: Date.now },
        type: {
          type: String,
          enum: ['created', 'joined', 'planning', 'reminder', 'journey', 'completed'],
          default: 'created',
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: member count
tripSchema.virtual('memberCount', {
  ref: 'Member',
  localField: '_id',
  foreignField: 'trip',
  count: true,
});

// Virtual: members
tripSchema.virtual('members', {
  ref: 'Member',
  localField: '_id',
  foreignField: 'trip',
});

// Index for efficient invite code lookups
tripSchema.index({ inviteCode: 1 });
tripSchema.index({ organizer: 1 });
tripSchema.index({ travelDate: 1 });

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;
