import Room from '../models/Room.js';
import UserModel from '../models/UserModel.js';
import { RoomReservation } from '../models/RoomReservation.js';
import { ThrowError } from '../utils/Error.utils.js';
import { sendBadRequestResponse } from '../utils/Response.utils.js';
import mongoose from 'mongoose';

const formatDateTime = (value) => {
    if (!value) return "";

    return new Date(value).toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

const attachCheckoutReservationData = async (rooms) => {
    if (!rooms.length) return [];

    const roomIds = rooms.map((room) => room._id);
    const checkedOutReservations = await RoomReservation.find({
        room: { $in: roomIds },
        status: "Checked Out"
    })
        .sort({ updatedAt: -1, createdAt: -1 })
        .lean();

    const latestReservationByRoom = new Map();

    checkedOutReservations.forEach((reservation) => {
        const roomId = reservation.room?.toString();
        if (roomId && !latestReservationByRoom.has(roomId)) {
            latestReservationByRoom.set(roomId, reservation);
        }
    });

    return rooms.map((roomDoc) => {
        const room = roomDoc.toObject ? roomDoc.toObject() : roomDoc;
        const reservation = latestReservationByRoom.get(room._id.toString());

        return {
            ...room,
            checkoutReservation: reservation ? {
                id: reservation._id,
                bookingRef: reservation.bookingRef,
                guestName: `${reservation.first_name} ${reservation.last_name}`.trim(),
                phone: reservation.phone,
                email: reservation.email,
                checkIn: reservation.checkIn,
                checkOut: reservation.checkOut,
                checkInTime: reservation.checkInTime,
                checkOutTime: reservation.checkOutTime,
                checkedOutAt: reservation.updatedAt,
                checkedOutAtFormatted: formatDateTime(reservation.updatedAt)
            } : null
        };
    });
};

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
                cleanStatus: 'In Progress',
                status: 'Maintenance',
                lastUpdatedBy: null,
                lastUpdatedByName: "",
                cleanedAt: null
            },
            { new: true }
        ).populate('assignedHousekeeper', 'full_name')
            .populate('lastUpdatedBy', 'full_name');

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
        const validStatuses = ['In Progress', 'Done'];

        if (!mongoose.Types.ObjectId.isValid(roomId)) {
            return sendBadRequestResponse(res, "Invalid Room ID format");
        }

        if (!cleanStatus) {
            return sendBadRequestResponse(res, "Clean status is required");
        }

        if (!validStatuses.includes(cleanStatus)) {
            return sendBadRequestResponse(res, "Clean status must be In Progress or Done");
        }

        const currentRoom = await Room.findById(roomId);
        if (!currentRoom) return ThrowError(res, 404, "Room not found");

        const oldStatus = currentRoom.cleanStatus;
        const updateData = {
            cleanStatus,
            lastUpdatedBy: req.user._id,
            lastUpdatedByName: req.user.full_name || ""
        };

        if (cleanStatus === 'Done') {
            updateData.status = 'Available';
            updateData.cleanedAt = new Date();
            updateData.assignedHousekeeper = null;
        } else if (cleanStatus === 'In Progress') {
            updateData.status = 'Maintenance';
            updateData.cleanedAt = null;
        }

        const updatedRoom = await Room.findByIdAndUpdate(roomId, updateData, { new: true })
            .populate('assignedHousekeeper', 'full_name')
            .populate('lastUpdatedBy', 'full_name');

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

        if (!mongoose.Types.ObjectId.isValid(roomId)) {
            return sendBadRequestResponse(res, "Invalid Room ID format");
        }

        const room = await Room.findByIdAndUpdate(
            roomId,
            {
                status: 'Available',
                cleanStatus: 'Done',
                assignedHousekeeper: null,
                lastUpdatedBy: req.user._id,
                lastUpdatedByName: req.user.full_name || "",
                cleanedAt: new Date()
            },
            { new: true }
        );

        if (!room) return ThrowError(res, 404, "Room not found");

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
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const activeCleaningQuery = {
            $or: [
                { status: 'Maintenance', cleanStatus: 'In Progress' },
                { cleanStatus: 'In Progress' },
                { cleanStatus: 'Done', cleanedAt: { $gte: startOfToday } }
            ]
        };

        const rooms = await Room.find(activeCleaningQuery)
            .populate('assignedHousekeeper', 'full_name')
            .populate('lastUpdatedBy', 'full_name')
            .populate('roomType', 'display_name')
            .sort({ cleanStatus: 1, cleanedAt: -1, updatedAt: -1 });

        const tasks = await attachCheckoutReservationData(rooms);

        const [roomsToCleanCount, inProgressCount, cleanedTodayCount] = await Promise.all([
            Room.countDocuments({
                status: 'Maintenance',
                cleanStatus: 'In Progress'
            }),
            Room.countDocuments({
                status: 'Maintenance',
                cleanStatus: 'In Progress'
            }),
            Room.countDocuments({
                cleanStatus: 'Done',
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
                tasks
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
            Room.countDocuments({
                status: 'Maintenance',
                cleanStatus: 'In Progress'
            }),
            Room.countDocuments({
                status: 'Maintenance',
                cleanStatus: 'In Progress'
            }),
            Room.countDocuments({
                cleanStatus: 'Done',
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
