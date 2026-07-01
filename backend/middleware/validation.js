import { body } from 'express-validator';

export const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

export const forgotPasswordValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
];

export const resetPasswordValidation = [
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),
];

export const updatePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),

  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('New password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('New password must contain at least one number'),
];

export const tripValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Trip name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Trip name must be between 3 and 100 characters'),

  body('destination')
    .trim()
    .notEmpty().withMessage('Destination is required'),

  body('travelDate')
    .notEmpty().withMessage('Travel date is required')
    .isISO8601().withMessage('Invalid travel date format')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Travel date must be in the future');
      }
      return true;
    }),

  body('maxMembers')
    .notEmpty().withMessage('Maximum members is required')
    .isInt({ min: 2, max: 50 }).withMessage('Maximum members must be between 2 and 50'),
];

export const memberUpdateValidation = [
  body('boardingStation')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Boarding station name is too long'),

  body('passengerCount')
    .optional()
    .isInt({ min: 1, max: 10 }).withMessage('Passenger count must be between 1 and 10'),

  body('passengers')
    .optional()
    .isArray().withMessage('Passengers must be an array'),

  body('passengers.*.name')
    .optional()
    .trim()
    .notEmpty().withMessage('Passenger name is required')
    .isLength({ max: 50 }).withMessage('Passenger name is too long'),
];
