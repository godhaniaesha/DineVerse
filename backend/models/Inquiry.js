import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
    {
        full_name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            trim: true
        },
        reason: {
            type: String,
            default:null,
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
            default: 'Open'
        }
    },
    { timestamps: true }
);

export const Inquiry = mongoose.model("Inquiry", inquirySchema);