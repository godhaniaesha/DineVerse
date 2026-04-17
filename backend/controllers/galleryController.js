import { Gallery } from "../models/Gallery.js";
import { uploadFile, deleteFileFromS3 } from "../utils/uploadFile.utils.js";
import { sendBadRequestResponse } from "../utils/Response.utils.js";
import { ThrowError } from "../utils/Error.utils.js";
import mongoose from "mongoose";
export const addImage = async (req, res) => {
    try {
        const { title, visibility } = req.body;

        if (!title) return sendBadRequestResponse(res, "Title is required");
        if (!req.file) return sendBadRequestResponse(res, "Image is required");

        const uploadResult = await uploadFile(req.file);

        const image = await Gallery.create({
            title,
            img: uploadResult.url,
            visibility: visibility || "Visible",
            addedBy: req.user?._id
        });

        return res.status(201).json({
            success: true,
            msg: "Image added successfully",
            data: image
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const getGallery = async (req, res) => {
    try {
        const images = await Gallery.find({}).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            msg: "Gallery fetched successfully",
            data: images
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const updateImage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Image ID format");
        }

        const image = await Gallery.findById(id);
        if (!image) return ThrowError(res, 404, "Image not found");

        if (req.file) {
            if (image.img) await deleteFileFromS3(image.img);
            const uploadResult = await uploadFile(req.file);
            image.img = uploadResult.url;
        }

        image.title = req.body.title || image.title;
        image.visibility = req.body.visibility || image.visibility;

        const updated = await image.save();

        return res.status(200).json({
            success: true,
            msg: "Image updated successfully",
            data: updated
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const toggleVisibility = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Image ID format");
        }

        const image = await Gallery.findById(id);
        if (!image) return ThrowError(res, 404, "Image not found");

        image.visibility = image.visibility === "Visible" ? "Hidden" : "Visible";
        await image.save();

        return res.status(200).json({
            success: true,
            msg: `Image is now ${image.visibility}`,
            data: image
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const deleteImage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Image ID format");
        }

        const image = await Gallery.findById(id);
        if (!image) return ThrowError(res, 404, "Image not found");

        if (image.img) await deleteFileFromS3(image.img);

        await image.deleteOne();

        return res.status(200).json({
            success: true,
            msg: "Image deleted successfully",
            data: image
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};