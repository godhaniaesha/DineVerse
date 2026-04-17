import Room from '../models/Room.js';
import UserModel from '../models/UserModel.js';
import { ThrowError } from '../utils/Error.utils.js';
import { sendBadRequestResponse } from '../utils/Response.utils.js';
import mongoose from 'mongoose';
export const getHousekeepingStaff = async (req, res) => {
    try {
        const staff = await UserModel.find({ role: 'Housekeeping', status: 'Active' }).select('-password');
        res.status(200).json({
            success: true,
            msg: "Housekeeping staff fetched successfully",
            data: staff
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const assignHousekeeper = async (req, res) => {
    try {
        const { roomId, housekeeperId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(roomId) || !mongoose.Types.ObjectId.isValid(housekeeperId)) {
            return sendBadRequestResponse(res, "Invalid Room or Housekeeper ID");
        }

        const housekeeper = await UserModel.findOne({ _id: housekeeperId, role: 'Housekeeping', status: 'Active' });
        if (!housekeeper) {
            return ThrowError(res, 404, "Active Housekeeper not found");
        }

        const room = await Room.findByIdAndUpdate(
            roomId,
            {
                assignedHousekeeper: housekeeperId,
                cleanStatus: 'Pending',
                status: 'Maintenance'
            },
            { new: true }
        ).populate('assignedHousekeeper', 'full_name');

        if (!room) return ThrowError(res, 404, "Room not found");

        res.status(200).json({
            success: true,
            msg: `Task assigned to ${housekeeper.full_name}`,
            data: room
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const updateCleanStatus = async (req, res) => {
    try {
        const { roomId, cleanStatus } = req.body;
        const currentRoom = await Room.findById(roomId);
        if (!currentRoom) return ThrowError(res, 404, "Room not found");

        const oldStatus = currentRoom.cleanStatus;
        let updateData = { cleanStatus: cleanStatus };

        if (cleanStatus === 'Clean') {
            updateData.status = 'Available';
            updateData.cleanedAt = new Date();
            updateData.assignedHousekeeper = null;
        } else if (cleanStatus === 'In Progress') {
            updateData.status = 'Maintenance';
            updateData.cleanedAt = null;
        }

        const updatedRoom = await Room.findByIdAndUpdate(roomId, updateData, { new: true })
            .populate('assignedHousekeeper', 'full_name');

        res.status(200).json({
            success: true,
            msg: `Status changed from ${oldStatus} to ${cleanStatus}`,
            data: { currentStatus: oldStatus, newStatus: cleanStatus, roomDetails: updatedRoom }
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const approveRoomCleaning = async (req, res) => {
    try {
        const { roomId } = req.body;

        const room = await Room.findByIdAndUpdate(
            roomId,
            {
                status: 'Available',
                cleanStatus: 'Clean',
                assignedHousekeeper: null
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            msg: "Room approved and now Available for booking",
            data: room
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const getHousekeepingTasks = async (req, res) => {
    try {
        const { role, _id } = req.user;
        let query = {};
        if (role === 'Housekeeping') {
            query = {
                assignedHousekeeper: _id,
                cleanStatus: { $in: ['Pending', 'In Progress', 'Dirty'] }
            };
        } else {
            query = {
                $or: [
                    { cleanStatus: { $in: ['Pending', 'In Progress', 'Dirty'] } },
                    { status: 'Maintenance' }
                ]
            };
        }

        const rooms = await Room.find(query)
            .populate('assignedHousekeeper', 'full_name')
            .populate('roomType', 'display_name');
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const [roomsToCleanCount, inProgressCount, cleanedTodayCount] = await Promise.all([
            Room.countDocuments({ cleanStatus: 'Pending' }),
            Room.countDocuments({ cleanStatus: 'In Progress' }),
            Room.countDocuments({
                cleanStatus: 'Clean',
                cleanedAt: { $gte: startOfToday }
            })
        ]);

        res.status(200).json({
            success: true,
            msg: "Housekeeping tasks fetched successfully",
            data: {
                stats: {
                    roomsToClean: roomsToCleanCount,
                    inProgress: inProgressCount,
                    cleanedToday: cleanedTodayCount
                },
                tasks: rooms
            }
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const getHousekeepingStats = async (req, res) => {
    try {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const [roomsToClean, inProgress, cleanedToday] = await Promise.all([
            Room.countDocuments({ cleanStatus: 'Pending' }),
            Room.countDocuments({ cleanStatus: 'In Progress' }),
            Room.countDocuments({
                cleanStatus: 'Clean',
                cleanedAt: { $gte: startOfToday, $lte: endOfToday }
            })
        ]);

        res.status(200).json({
            success: true,
            msg: "Housekeeping stats fetched successfully",
            data: { roomsToClean, inProgress, cleanedToday }
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};