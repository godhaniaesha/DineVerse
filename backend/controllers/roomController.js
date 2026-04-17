import RoomType from '../models/RoomType.js';
import Room from '../models/Room.js';
import { ThrowError } from '../utils/Error.utils.js';
import { uploadFile, deleteFileFromS3 } from '../utils/uploadFile.utils.js';
import { sendBadRequestResponse } from '../utils/Response.utils.js';
import mongoose from 'mongoose';
export const addRoomType = async (req, res) => {
    try {
        const { name, display_name, description, price_per_night, features, status } = req.body;

        if (!name) {
            return ThrowError(res, 400, "Room type name is required");
        }

        const exists = await RoomType.findOne({ name });
        if (exists) {
            return ThrowError(res, 400, "Room type with this name already exists");
        }

        let image_url = "";
        if (req.file) {
            const uploadResult = await uploadFile(req.file);
            image_url = uploadResult.url;
        }

        let parsedFeatures = [];
        if (features) {
            try {
                parsedFeatures = JSON.parse(features);
            } catch (e) {
                parsedFeatures = [features];
            }
        }

        const roomType = await RoomType.create({
            name,
            display_name,
            description,
            price_per_night,
            image_url,
            features: parsedFeatures,
            status
        });

        res.status(201).json({
            success: true,
            msg: "Room type added successfully",
            data: roomType
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const getRoomTypes = async (req, res) => {
    try {
        const roomTypes = await RoomType.find({});
        res.status(200).json({
            success: true,
            msg: "Room types fetched successfully",
            data: roomTypes
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const updateRoomType = async (req, res) => {
    try {
        const { name, display_name, description, price_per_night, features, status } = req.body;

        const roomType = await RoomType.findById(req.params.id);
        if (!roomType) {
            return ThrowError(res, 404, "Room type not found");
        }

        if (req.file) {
            if (roomType.image_url) {
                await deleteFileFromS3(roomType.image_url);
            }
            const uploadResult = await uploadFile(req.file);
            roomType.image_url = uploadResult.url;
        }

        roomType.name = name || roomType.name;
        roomType.display_name = display_name || roomType.display_name;
        roomType.description = description || roomType.description;
        roomType.price_per_night = price_per_night || roomType.price_per_night;
        roomType.status = status || roomType.status;

        if (features) {
            try {
                roomType.features = JSON.parse(features);
            } catch (e) {
                roomType.features = [features];
            }
        }

        const updatedRoomType = await roomType.save();

        res.status(200).json({
            success: true,
            msg: "Room type updated successfully",
            data: updatedRoomType
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const deleteRoomType = async (req, res) => {
    try {
        const roomType = await RoomType.findById(req.params.id);
        if (!roomType) {
            return ThrowError(res, 404, "No any Room type not found");
        }
        const roomsUsing = await Room.countDocuments({ roomType: req.params.id });
        if (roomsUsing > 0) {
            return ThrowError(res, 400, `Cannot delete. ${roomsUsing} rooms are currently using this type.`);
        }

        if (roomType.image_url) {
            await deleteFileFromS3(roomType.image_url);
        }

        await roomType.deleteOne();
        res.status(200).json({
            success: true,
            msg: "Room type deleted successfully",
            data: roomType
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const addRoom = async (req, res) => {
    try {
        const { roomNumber, floor, roomType, capacity_adults, capacity_childs, status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(roomType)) {
            return sendBadRequestResponse(res, "Invalid RoomType!!!")
        }

        const checkRoomTypeExists = await RoomType.findById(roomType)
        if (!checkRoomTypeExists) {
            return sendBadRequestResponse(res, "RoomType not exists!!!")
        }

        const exists = await Room.findOne({ roomNumber });
        if (exists) {
            return sendBadRequestResponse(res, "Room with this number already exists");
        }

        const room = await Room.create({
            roomNumber, floor, roomType, capacity_adults, capacity_childs, status
        });

        res.status(201).json({
            success: true,
            msg: "Room added successfully",
            data: room
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({}).populate('roomType', 'display_name price_per_night');

        if (!rooms || rooms.length === 0) {
            return sendBadRequestResponse(res, "No Rooms found");
        }

        res.status(200).json({
            success: true,
            msg: "Rooms fetched successfully",
            data: rooms
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const searchRooms = async (req, res) => {
    try {
        const { search, type, status } = req.query;
        let query = {};

        if (search) {
            query.roomNumber = new RegExp(search, "i");
        }

        let rooms = await Room.find(query).populate('roomType', 'name display_name price_per_night amenities features');

        if (search) {
            const regex = new RegExp(search, "i");
            const allRooms = await Room.find({}).populate('roomType');
            const typeMatched = allRooms.filter(r => r.roomType && (regex.test(r.roomType.name) || regex.test(r.roomType.display_name)));

            const map = new Map();
            rooms.forEach(r => map.set(r._id.toString(), r));
            typeMatched.forEach(r => map.set(r._id.toString(), r));
            rooms = Array.from(map.values());
        }

        if (type && type !== "All Types") {
            rooms = rooms.filter(r => r.roomType && r.roomType.display_name === type);
        }

        if (status && status !== "All statuses" && status !== "All Status") {
            rooms = rooms.filter(r => r.status === status);
        }

        res.status(200).json({
            success: true,
            msg: "Rooms searched successfully",
            data: rooms
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getRoomById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Room ID!!!")
        }

        const room = await Room.findById(id).populate('roomType', 'display_name price_per_night');

        if (!room) {
            return sendBadRequestResponse(res, "No ant Rooms found")
        }

        res.status(200).json({
            success: true,
            msg: "Rooms fetched successfully",
            data: room
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const { roomType, roomNumber } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Room ID format");
        }
        if (roomType) {
            if (!mongoose.Types.ObjectId.isValid(roomType)) {
                return sendBadRequestResponse(res, "Invalid RoomType ID format");
            }
            const checkRoomTypeExists = await RoomType.findById(roomType);
            if (!checkRoomTypeExists) {
                return ThrowError(res, 404, "RoomType does not exist");
            }
        }
        if (roomNumber) {
            const exists = await Room.findOne({ roomNumber, _id: { $ne: id } });
            if (exists) {
                return sendBadRequestResponse(res, "Another room with this number already exists");
            }
        }
        const room = await Room.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!room) {
            return ThrowError(res, 404, "Room not found");
        }

        res.status(200).json({
            success: true,
            msg: "Room updated successfully",
            data: room
        });

    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Room ID!!!")
        }

        const room = await Room.findById(id);
        if (!room) {
            return ThrowError(res, 404, "Room not found");
        }

        await room.deleteOne();
        res.status(200).json({
            success: true,
            msg: "Room deleted successfully",
            data: room
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};