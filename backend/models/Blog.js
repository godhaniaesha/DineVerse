import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        short_des: {
            type: String,
            trim: true
        },
        des: {
            type: String,
            trim: true
        },
        coverImg: {
            type: String,
            default: ""
        },
        area: {
            type: String,
            enum: ["Restaurant", "Cafe", "Bar"],
            default: "Restaurant"
        },
        status: {
            type: String,
            enum: ["published", "draft"],
            default: "draft"
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

export const Blog = mongoose.model("Blog", blogSchema);