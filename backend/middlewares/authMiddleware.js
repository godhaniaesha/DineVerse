import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
import { ThrowError } from '../utils/Error.utils.js';
import dotenv from 'dotenv';
dotenv.config();

export const UserAuth = async (req, res, next) => {
    try {
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not configured');
            return ThrowError(res, 500, 'Server configuration error');
        }

        const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '') || req.query.token;

        if (!token) {
            return ThrowError(res, 401, "Access denied. No token provided.");
        }

        try {
            const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
            const { userId } = decodedObj;

            const user = await UserModel.findById(userId).select('-password');
            if (!user) {
                return ThrowError(res, 404, "User not found");
            }

            req.user = user;
            next();
        } catch (err) {
            console.error('Token verification error:', err);
            return ThrowError(res, 401, "Invalid token.");
        }
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return async (req, res, next) => {
        try {
            if (!req.user) {
                return ThrowError(res, 401, "Authentication required");
            }

            if (roles.length && !roles.includes(req.user.role)) {
                return ThrowError(res, 403, `Access denied. ${roles.join(' or ')} role required.`);
            }

            next();
        } catch (error) {
            return ThrowError(res, 500, error.message);
        }
    };
};

export const superAdminAuth = authorize('Super Admin');
export const managerAuth = authorize('Manager');
export const adminManagerAuth = authorize(['Super Admin', 'Manager']);
export const waiterAuth = authorize(['Cafe Waiter', 'Restaurant Waiter', 'Bar Waiter', 'Super Admin', 'Manager']);
export const chefAuth = authorize(['Chef', 'Super Admin', 'Manager']);
export const housekeepingAuth = authorize(['Housekeeping', 'Super Admin', 'Manager']);

export const isStaff = async (req, res, next) => {
    try {
        if (!req.user || !['Super Admin', 'Manager', 'Housekeeping', 'Cafe Waiter', 'Restaurant Waiter', 'Bar Waiter', 'Chef'].includes(req.user.role)) {
            return ThrowError(res, 403, "Access denied. Staff privileges required.");
        }
        next();
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};