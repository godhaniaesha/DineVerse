import Cuisine from '../models/Cuisine.js';
import { ThrowError } from '../utils/Error.utils.js';
import { sendBadRequestResponse } from '../utils/Response.utils.js';
import { uploadFile, deleteFileFromS3 } from '../utils/uploadFile.utils.js';
import mongoose from 'mongoose';
export const addCuisine = async (req, res) => {
    try {
        const { name, description, area, status } = req.body;

        if (!name) {
            return sendBadRequestResponse(res, "Cuisine name is required");
        }

        const exists = await Cuisine.findOne({ name });
        if (exists) {
            return sendBadRequestResponse(res, "Cuisine already exists");
        }

        let img = "";
        if (req.file) {
            const uploadResult = await uploadFile(req.file);
            img = uploadResult.url;
        }

        let parsedArea = [];
        if (area) {
            try {
                parsedArea = JSON.parse(area);
            } catch (e) {
                parsedArea = [area];
            }
        }

        const cuisine = await Cuisine.create({
            name,
            img,
            description,
            area: parsedArea,
            status: status || 'Active'
        });

        res.status(201).json({
            success: true,
            msg: "Cuisine added successfully",
            data: cuisine
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const getCuisines = async (req, res) => {
    try {
        const cuisines = await Cuisine.find({});

        if (cuisines.length == 0) {
            return sendBadRequestResponse(res, "No cuisines found");
        }

        res.status(200).json({
            success: true,
            msg: "Cuisines fetched successfully",
            data: cuisines
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const searchCuisines = async (req, res) => {
    try {
        const { search, area, status } = req.query;
        let query = {};

        if (search) {
            const regex = new RegExp(search, 'i');
            query.$or = [
                { name: regex },
                { description: regex },
                { area: regex }
            ];
        }

        if (area && area !== "All" && area !== "None") {
            query.area = area;
        }

        if (status && status !== "All" && status !== "None") {
            query.status = status;
        }

        const cuisines = await Cuisine.find(query);

        res.status(200).json({
            success: true,
            msg: "Cuisines searched successfully",
            data: cuisines
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const getCuisineById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Cuisine ID format");
        }

        const cuisine = await Cuisine.findById(id);
        if (!cuisine) {
            return ThrowError(res, 404, "Cuisine not found");
        }

        res.status(200).json({
            success: true,
            msg: "Cuisine fetched successfully",
            data: cuisine
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const updateCuisine = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, area } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Cuisine ID format");
        }

        const cuisine = await Cuisine.findById(id);
        if (!cuisine) {
            return ThrowError(res, 404, "Cuisine not found");
        }

        if (name) {
            const exists = await Cuisine.findOne({ name, _id: { $ne: id } });
            if (exists) {
                return sendBadRequestResponse(res, "Another cuisine with this name already exists");
            }
        }

        if (req.file) {
            if (cuisine.img) {
                await deleteFileFromS3(cuisine.img);
            }
            const uploadResult = await uploadFile(req.file);
            cuisine.img = uploadResult.url;
        }

        if (area) {
            try {
                cuisine.area = JSON.parse(area);
            } catch (e) {
                cuisine.area = [area];
            }
        }

        cuisine.name = name || cuisine.name;
        cuisine.description = req.body.description || cuisine.description;
        cuisine.status = req.body.status || cuisine.status;

        const updatedCuisine = await cuisine.save();

        res.status(200).json({
            success: true,
            msg: "Cuisine updated successfully",
            data: updatedCuisine
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const deleteCuisine = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Cuisine ID format");
        }

        const cuisine = await Cuisine.findById(id);
        if (!cuisine) {
            return ThrowError(res, 404, "Cuisine not found");
        }

        if (cuisine.img) {
            await deleteFileFromS3(cuisine.img);
        }

        await cuisine.deleteOne();
        res.status(200).json({
            success: true,
            msg: "Cuisine deleted successfully",
            data: cuisine
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};