export const CONFIG = {
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  BCRYPT_ROUNDS: 12,
  INVITE_CODE_LENGTH: 8,
  MAX_TRIP_MEMBERS: 50,
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: 100,
  AUTH_RATE_LIMIT_MAX: 10,
};

export const SEAT_TYPES = [
  'window',
  'lower_berth',
  'upper_berth',
  'side_lower',
  'side_upper',
  'adjacent_seats',
  'same_coach',
  'same_compartment',
];

export const TRIP_STATUS = {
  PLANNING: 'planning',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const MEMBER_STATUS = {
  PENDING: 'pending',
  READY: 'ready',
};

export const NOTIFICATION_TYPES = {
  MEMBER_JOINED: 'member_joined',
  MEMBER_UPDATED: 'member_updated',
  TRIP_UPDATED: 'trip_updated',
  JOURNEY_REMINDER: 'journey_reminder',
  TRIP_READY: 'trip_ready',
};
