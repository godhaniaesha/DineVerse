import { body } from 'express-validator';

export const registerValidation = [
    body('full_name')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isString().withMessage('Full name must be a string')
        .isLength({ min: 2, max: 50 }).withMessage('Full name must be between 2 and 50 characters')
        .matches(/^[A-Za-z\s]+$/).withMessage('Full name must contain only letters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .isNumeric().withMessage('Phone number must contain only digits')
        .isLength({ min: 10, max: 15 }).withMessage('Phone number must be between 10 and 15 digits'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role')
        .optional()
        .isString().withMessage('Role must be a string')
        .isIn(['Super Admin', 'Manager', 'Housekeeping', 'Cafe Waiter', 'Restaurant Waiter', 'Bar Waiter', 'Chef', 'User'])
        .withMessage('Invalid role selected')
];

export const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address'),
    body('password')
        .notEmpty().withMessage('Password is required')
];

export const staffValidation = [
    body('full_name')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isString().withMessage('Full name must be a string')
        .isLength({ min: 2, max: 50 }).withMessage('Full name must be between 2 and 50 characters')
        .matches(/^[A-Za-z\s]+$/).withMessage('Full name must contain only letters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address'),
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .isNumeric().withMessage('Phone number must contain only digits')
        .isLength({ min: 10, max: 15 }).withMessage('Phone number must be between 10 and 15 digits'),
    body('role')
        .notEmpty().withMessage('Role is required')
        .isString().withMessage('Role must be a string')
        .isIn(['Manager', 'Housekeeping', 'Cafe Waiter', 'Restaurant Waiter', 'Bar Waiter', 'Chef'])
        .withMessage('Invalid staff role'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

export const dishValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Dish name is required')
        .isString().withMessage('Dish name must be a string')
        .isLength({ min: 2, max: 100 }).withMessage('Dish name must be between 2 and 100 characters'),
    body('price')
        .notEmpty().withMessage('Price is required')
        .isNumeric().withMessage('Price must be a number')
        .custom(value => value > 0).withMessage('Price must be greater than 0'),
    body('cat_id')
        .notEmpty().withMessage('Category ID is required')
        .isString().withMessage('Category ID must be a string'),
    body('area')
        .notEmpty().withMessage('Area is required')
];

export const reservationValidation = [
    body('guest_name')
        .trim()
        .notEmpty().withMessage('Guest name is required')
        .isString().withMessage('Guest name must be a string'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Valid email is required'),
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .isNumeric().withMessage('Phone number must contain only digits'),
    body('checkIn')
        .notEmpty().withMessage('Check-in date is required')
        .isISO8601().withMessage('Invalid check-in date format'),
    body('checkOut')
        .notEmpty().withMessage('Check-out date is required')
        .isISO8601().withMessage('Invalid check-out date format')
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.checkIn)) {
                throw new Error('Check-out date must be after check-in date');
            }
            return true;
        })
];

export const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isString().withMessage('Category name must be a string')
        .isLength({ min: 2, max: 50 }).withMessage('Category name must be between 2 and 50 characters'),
    body('area')
        .notEmpty().withMessage('Area is required')
];

export const cuisineValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Cuisine name is required')
        .isString().withMessage('Cuisine name must be a string')
        .isLength({ min: 2, max: 50 }).withMessage('Cuisine name must be between 2 and 50 characters')
];

export const inquiryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be a string'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Valid email is required'),
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .isNumeric().withMessage('Phone number must contain only digits'),
    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isString().withMessage('Message must be a string')
        .isLength({ min: 10 }).withMessage('Message must be at least 10 characters long')
];

export const reviewValidation = [
    body('rating')
        .notEmpty().withMessage('Rating is required')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
    body('comment')
        .trim()
        .notEmpty().withMessage('Comment is required')
        .isString().withMessage('Comment must be a string')
        .isLength({ min: 5 }).withMessage('Comment must be at least 5 characters long'),
    body('area')
        .notEmpty().withMessage('Area is required')
        .isString().withMessage('Area must be a string')
];

export const roomTypeValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isString().withMessage('Title must be a string')
        .isLength({ min: 2, max: 50 }).withMessage('Title must be between 2 and 50 characters'),
    body('pricePerNight')
        .notEmpty().withMessage('Price per night is required')
        .isNumeric().withMessage('Price must be a number')
        .custom(value => value > 0).withMessage('Price must be greater than 0'),
    body('capacity')
        .notEmpty().withMessage('Capacity is required')
        .isInt({ min: 1 }).withMessage('Capacity must be an integer and at least 1')
];

export const roomValidation = [
    body('roomNumber')
        .trim()
        .notEmpty().withMessage('Room number is required')
        .isString().withMessage('Room number must be a string'),
    body('roomType')
        .notEmpty().withMessage('Room type is required')
        .isString().withMessage('Room type ID must be a string'),
    body('status')
        .optional()
        .isString().withMessage('Status must be a string')
        .isIn(['Available', 'Booked', 'Cleaning', 'Maintenance'])
        .withMessage('Invalid room status')
];

export const tableValidation = [
    body('tableNumber')
        .trim()
        .notEmpty().withMessage('Table number is required')
        .isString().withMessage('Table number must be a string'),
    body('capacity')
        .notEmpty().withMessage('Capacity is required')
        .isInt({ min: 1 }).withMessage('Capacity must be an integer and at least 1'),
    body('area')
        .notEmpty().withMessage('Area is required')
        .isString().withMessage('Area must be a string')
        .isIn(['Restaurant', 'Cafe', 'Bar'])
        .withMessage('Invalid area selected')
];

export const blogValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isString().withMessage('Title must be a string'),
    body('content')
        .trim()
        .notEmpty().withMessage('Content is required')
        .isString().withMessage('Content must be a string')
];

// Helper to make rules optional for update routes
export const updateValidation = (rules) => {
    return rules.map(rule => {
        // For password field, make it truly optional (skip if empty)
        // For other fields, make them optional but validate if provided
        return rule.optional({ checkFalsy: true });
    });
};
