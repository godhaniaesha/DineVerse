import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        category: {
            type: String,
            required: true,
            enum: ["Ambiance", "Dishes", "Bar", "Events", "Restaurant"],
            default: "Ambiance"
        },
        img: {
            type: String,
            required: true
        },
        visibility: {
            type: String,
            enum: ["Visible", "Hidden"],
            default: "Visible"
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
);

export const Gallery = mongoose.model("Gallery", gallerySchema);