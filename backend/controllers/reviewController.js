import Review from '../models/Review.js';
import User from '../models/UserModel.js';
import mongoose from 'mongoose';
import { ThrowError } from '../utils/Error.utils.js';
import { sendBadRequestResponse } from '../utils/Response.utils.js';

export const addReview = async (req, res) => {
    try {
        const { area, rating, message, tags, profession } = req.body;
        const userId = req.user._id;

        if (!area || !rating || !message) {
            return sendBadRequestResponse(res, "Area, rating, and message are required");
        }

        const validAreas = ["Restaurant", "Cafe", "Bar"];
        if (!validAreas.includes(area)) {
            return sendBadRequestResponse(res, "Invalid area. Must be Restaurant, Cafe, or Bar");
        }

        if (rating < 1 || rating > 5) {
            return sendBadRequestResponse(res, "Rating must be between 1 and 5");
        }

        const existingReview = await Review.findOne({ user: userId, area: area });
        if (existingReview) {
            return res.status(400).json({ success: false, msg: `You have already reviewed the ${area}` });
        }

        const review = new Review({
            user: userId,
            area,
            rating,
            message,
            tags: tags || "",
            profession: profession || ""
        });

        await review.save();
        res.status(201).json({ success: true, msg: "Review added successfully", data: review });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'full_name phone')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            msg: "Reviews fetched successfully",
            data: reviews
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid review ID");
        }

        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ success: false, msg: "Review not found" });
        }

        await Review.findByIdAndDelete(id);
        res.status(200).json({ success: true, msg: "Review deleted successfully" });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getAreaReviews = async (req, res) => {
    try {
        const { area } = req.params;

        const reviews = await Review.find({ area })
            .populate('user', 'full_name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            msg: `${area} reviews fetched successfully`,
            data: reviews
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getUserReviews = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return sendBadRequestResponse(res, "Invalid user ID");
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        const reviews = await Review.find({ user: userId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            msg: "User reviews fetched successfully",
            data: reviews
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};