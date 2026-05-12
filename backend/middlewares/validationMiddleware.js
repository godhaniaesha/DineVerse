import { validationResult } from 'express-validator';
import { ThrowError } from '../utils/Error.utils.js';

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

    // Return the first error message for simplicity or all errors
    return ThrowError(res, 400, errors.array()[0].msg, extractedErrors);
};
