import Table from '../models/Table.js';
import { ThrowError } from '../utils/Error.utils.js';
import { sendBadRequestResponse } from '../utils/Response.utils.js';
import mongoose from 'mongoose';

// ✅ ADD TABLE (Admin/Manager)
export const addTable = async (req, res) => {
    try {
        const { tableNo, capacity, area, status } = req.body;

        if (!tableNo || !capacity || !area) {
            return sendBadRequestResponse(res, "Table number, capacity and area are required");
        }

        if (!["Restaurant", "Cafe", "Bar"].includes(area)) {
            return sendBadRequestResponse(res, "Area must be one of: Restaurant, Cafe, Bar");
        }

        const exists = await Table.findOne({ tableNo });
        if (exists) {
            return sendBadRequestResponse(res, "Table with this number already exists");
        }

        const table = await Table.create({
            tableNo: String(tableNo).trim(),
            capacity: Number(capacity),
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

// ✅ GET ALL TABLES (Admin/Manager)
export const getTables = async (req, res) => {
    try {
        const tables = await Table.find({}).sort({ area: 1, tableNo: 1 });
        res.status(200).json({
            success: true,
            msg: "Tables fetched successfully",
            count: tables.length,
            data: tables
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// ✅ GET TABLE BY ID (Admin/Manager)
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

// ✅ UPDATE TABLE (Admin/Manager)
export const updateTable = async (req, res) => {
    try {
        const { id } = req.params;
        const { tableNo, capacity, area, status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Table ID format");
        }

        // Validate area if provided
        if (area && !["Restaurant", "Cafe", "Bar"].includes(area)) {
            return sendBadRequestResponse(res, "Area must be one of: Restaurant, Cafe, Bar");
        }

        // Validate status if provided
        if (status && !["Available", "Occupied", "Reserved"].includes(status)) {
            return sendBadRequestResponse(res, "Status must be one of: Available, Occupied, Reserved");
        }

        // Check if table number already exists
        if (tableNo) {
            const exists = await Table.findOne({ tableNo, _id: { $ne: id } });
            if (exists) {
                return sendBadRequestResponse(res, "Another table with this number already exists");
            }
        }

        const updateData = {};
        if (tableNo !== undefined) updateData.tableNo = String(tableNo).trim();
        if (capacity !== undefined) updateData.capacity = Number(capacity);
        if (area !== undefined) updateData.area = area;
        if (status !== undefined) updateData.status = status;

        const table = await Table.findByIdAndUpdate(
            id,
            { $set: updateData },
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

// ✅ DELETE TABLE (Admin/Manager)
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

// ✅ GET TABLES BY AREA (Public - for customers to see available areas)
export const getTablesByArea = async (req, res) => {
    try {
        const { area } = req.query;

        let query = {};

        if (area) {
            if (!["Restaurant", "Cafe", "Bar"].includes(area)) {
                return sendBadRequestResponse(res, "Invalid area. Must be one of: Restaurant, Cafe, Bar");
            }
            query.area = area;
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

// ✅ GET TABLES BY STATUS (Admin - for management view)
export const getTablesByStatus = async (req, res) => {
    try {
        const { status } = req.query;

        let query = {};
        if (status) {
            if (!["Available", "Occupied", "Reserved"].includes(status)) {
                return sendBadRequestResponse(res, "Invalid status");
            }
            query.status = status;
        }

        const tables = await Table.find(query).sort({ area: 1, tableNo: 1 });

        res.status(200).json({
            success: true,
            count: tables.length,
            msg: status ? `${status} tables fetched` : "All tables fetched",
            data: tables
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// ✅ GET TABLE STATISTICS (Admin Dashboard)
export const getTableStats = async (req, res) => {
    try {
        const total = await Table.countDocuments();
        const available = await Table.countDocuments({ status: "Available" });
        const occupied = await Table.countDocuments({ status: "Occupied" });
        const reserved = await Table.countDocuments({ status: "Reserved" });

        const byArea = await Table.aggregate([
            {
                $group: {
                    _id: "$area",
                    count: { $sum: 1 },
                    available: {
                        $sum: { $cond: [{ $eq: ["$status", "Available"] }, 1, 0] }
                    },
                    occupied: {
                        $sum: { $cond: [{ $eq: ["$status", "Occupied"] }, 1, 0] }
                    },
                    reserved: {
                        $sum: { $cond: [{ $eq: ["$status", "Reserved"] }, 1, 0] }
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            msg: "Table statistics fetched successfully",
            data: {
                summary: { total, available, occupied, reserved },
                byArea
            }
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// ✅ UPDATE TABLE STATUS (Admin - quick status update)
export const updateTableStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Table ID format");
        }

        if (!status || !["Available", "Occupied", "Reserved"].includes(status)) {
            return sendBadRequestResponse(res, "Invalid status. Must be one of: Available, Occupied, Reserved");
        }

        const table = await Table.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!table) {
            return ThrowError(res, 404, "Table not found");
        }

        res.status(200).json({
            success: true,
            msg: `Table status updated to ${status}`,
            data: table
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
