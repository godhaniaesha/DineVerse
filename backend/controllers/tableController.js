import Table from '../models/Table.js';
import { ThrowError } from '../utils/Error.utils.js';
import { sendBadRequestResponse } from '../utils/Response.utils.js';
import mongoose from 'mongoose';
export const addTable = async (req, res) => {
    try {
        const { tableNo, capacity, area, status } = req.body;

        if (!tableNo || !capacity || !area) {
            return sendBadRequestResponse(res, "Table number, capacity and area are required");
        }

        const exists = await Table.findOne({ tableNo });
        if (exists) {
            return sendBadRequestResponse(res, "Table with this number already exists");
        }

        const table = await Table.create({
            tableNo,
            capacity,
            area,
            status: status || 'Available'
        });

        res.status(201).json({
            success: true,
            msg: "Table added successfully",
            data: table
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const getTables = async (req, res) => {
    try {
        const tables = await Table.find({});
        res.status(200).json({
            success: true,
            msg: "Tables fetched successfully",
            data: tables
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const getTableById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Table ID format");
        }

        const table = await Table.findById(id);
        if (!table) {
            return ThrowError(res, 404, "Table not found");
        }

        res.status(200).json({
            success: true,
            msg: "Table fetched successfully",
            data: table
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const updateTable = async (req, res) => {
    try {
        const { id } = req.params;
        const { tableNo } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Table ID format");
        }

        if (tableNo) {
            const exists = await Table.findOne({ tableNo, _id: { $ne: id } });
            if (exists) {
                return sendBadRequestResponse(res, "Another table with this number already exists");
            }
        }

        const table = await Table.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!table) {
            return ThrowError(res, 404, "Table not found");
        }

        res.status(200).json({
            success: true,
            msg: "Table updated successfully",
            data: table
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const deleteTable = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Table ID format");
        }

        const table = await Table.findById(id);
        if (!table) {
            return ThrowError(res, 404, "Table not found");
        }

        await table.deleteOne();
        res.status(200).json({
            success: true,
            msg: "Table deleted successfully",
            data: table
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getTablesByArea = async (req, res) => {
    try {
        const { area } = req.query;

        let query = {};


        if (area) {

            query.area = { $regex: new RegExp(area, "i") };
        }

        const tables = await Table.find(query).sort({ tableNo: 1 });

        res.status(200).json({
            success: true,
            count: tables.length,
            msg: area ? `${area} tables fetched` : "All tables fetched",
            data: tables
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
