import { Inquiry } from "../models/Inquiry.js";
import { ThrowError } from "../utils/Error.utils.js";
import { sendBadRequestResponse } from "../utils/Response.utils.js";
import mongoose from "mongoose";
export const addInquiry = async (req, res) => {
    try {
        const { full_name, email, phone, reason, message } = req.body;

        if (!full_name || !email || !reason || !message) {
            return ThrowError(res, 400, 'Full name, email, reason and message are required');
        }

        const inquiry = await Inquiry.create({
            full_name,
            email,
            phone,
            reason,
            message
        });

        return res.status(201).json({
            success: true,
            msg: 'Inquiry submitted successfully',
            data: inquiry
        });

    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const getInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });

        if (!inquiries || inquiries.length === 0) {
            return ThrowError(res, 404, 'No inquiries found');
        }
        const formatted = inquiries.map(inq => ({
            ...inq._doc,
            date: new Date(inq.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).replace(/\//g, '-')
        }));

        return res.status(200).json({
            success: true,
            msg: 'Inquiries fetched successfully',
            data: formatted
        });

    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const getInquiryById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return ThrowError(res, 400, 'Invalid Inquiry ID format');
        }

        const inquiry = await Inquiry.findById(id);
        if (!inquiry) return ThrowError(res, 404, 'Inquiry not found');

        const formatted = {
            ...inquiry._doc,
            date: new Date(inquiry.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).replace(/\//g, '-')
        };

        return res.status(200).json({
            success: true,
            msg: 'Inquiry fetched successfully',
            data: formatted
        });

    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const updateInquiryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return ThrowError(res, 400, 'Invalid Inquiry ID format');
        }

        if (!status) return ThrowError(res, 400, 'Status is required');

        const inquiry = await Inquiry.findById(id);
        if (!inquiry) return ThrowError(res, 404, 'Inquiry not found');

        inquiry.status = status;
        await inquiry.save();

        return res.status(200).json({
            success: true,
            msg: 'Inquiry status updated successfully',
            data: inquiry
        });

    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const deleteInquiry = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return ThrowError(res, 400, 'Invalid Inquiry ID format');
        }

        const inquiry = await Inquiry.findById(id);
        if (!inquiry) return ThrowError(res, 404, 'Inquiry not found');

        await inquiry.deleteOne();

        return res.status(200).json({
            success: true,
            msg: 'Inquiry deleted successfully',
            data: inquiry
        });

    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};