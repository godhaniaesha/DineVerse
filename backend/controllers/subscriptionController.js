import Subscription from "../models/Subscription.js";
import { ThrowError } from "../utils/Error.utils.js";

export const subscribe = async (req, res) => {
    try {
        const { email, interests } = req.body;

        if (!email) {
            return ThrowError(res, 400, "Email is required");
        }

        const existing = await Subscription.findOne({ email: email.toLowerCase() });

        if (existing) {
            if (existing.status === 'Unsubscribed') {
                existing.status = 'Active';
                if (interests) existing.interests = interests;
                await existing.save();
                return res.status(200).json({
                    success: true,
                    msg: "Subscription reactivated successfully!",
                    data: existing
                });
            }
            return ThrowError(res, 400, "This email is already subscribed.");
        }

        const newSubscription = await Subscription.create({
            email,
            interests: interests || []
        });

        return res.status(201).json({
            success: true,
            msg: "Thank you for subscribing to DineVerse Digest!",
            data: newSubscription
        });

    } catch (error) {
        if (error.code === 11000) {
            return ThrowError(res, 400, "Email already exists");
        }
        return ThrowError(res, 500, error.message);
    }
};

export const getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: subscriptions.length,
            msg: "Subscriptions fetched successfully",
            data: subscriptions
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const deleteSubscription = async (req, res) => {
    try {
        const { id } = req.params;

        const subscription = await Subscription.findByIdAndDelete(id);

        if (!subscription) {
            return ThrowError(res, 404, "Subscription not found");
        }

        return res.status(200).json({
            success: true,
            msg: "Subscription deleted successfully"
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
