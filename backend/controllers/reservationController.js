import { RoomReservation } from "../models/RoomReservation.js";
import Room from "../models/Room.js";
import RoomType from "../models/RoomType.js";
import UserModel from "../models/UserModel.js";
import { ThrowError } from "../utils/Error.utils.js";
import { sendBadRequestResponse } from "../utils/Response.utils.js";
import mongoose from "mongoose";
import Stripe from "stripe";
import dotenv from "dotenv";
import { TableReservation } from "../models/TableReservation.js";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET);
const convertTo24Hour = (time) => {
    if (!time) return "00:00";
    if (!time.toLowerCase().includes("am") && !time.toLowerCase().includes("pm")) return time;

    const [timePart, modifier] = time.trim().split(" ");
    let [hours, minutes] = timePart.split(":");
    hours = parseInt(hours);
    minutes = minutes || "00";

    if (modifier.toLowerCase() === "am") {
        if (hours === 12) hours = 0;
    } else {
        if (hours !== 12) hours += 12;
    }

    return `${String(hours).padStart(2, "0")}:${minutes}`;
};

const calculateBilling = (checkIn, checkOut, checkInTime, checkOutTime, pricePerNight) => {
    const checkInTime24 = convertTo24Hour(checkInTime || "14:00");
    const checkOutTime24 = convertTo24Hour(checkOutTime || "11:00");

    const checkInDateTime = new Date(`${checkIn}T${checkInTime24}:00`);
    const checkOutDateTime = new Date(`${checkOut}T${checkOutTime24}:00`);

    const diffMs = checkOutDateTime - checkInDateTime;
    if (diffMs <= 0) return { hours: 0, nights: 0, totalAmount: 0, billingType: null };

    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    const hourlyRate = pricePerNight / 24;

    if (diffDays < 1) {
        const hours = Math.ceil(diffHours);
        return {
            hours,
            nights: 0,
            totalAmount: Math.round(hourlyRate * hours),
            billingType: "hourly",
            hourlyRate: Math.round(hourlyRate)
        };
    }

    const nights = Math.ceil(diffDays);
    return {
        hours: Math.round(diffHours),
        nights,
        totalAmount: pricePerNight * nights,
        billingType: "nightly",
        hourlyRate: Math.round(hourlyRate)
    };
};
export const validateGuestDetails = async (req, res) => {
    try {
        const {
            first_name, last_name, email, phone,
            checkIn, checkOut, checkInTime, checkOutTime,
            adults, children
        } = req.body;

        if (!first_name || !last_name || !email || !phone || !checkIn || !checkOut || !adults) {
            return ThrowError(res, 400, "All required fields are missing");
        }

        const checkInTime24 = convertTo24Hour(checkInTime || "14:00");
        const checkOutTime24 = convertTo24Hour(checkOutTime || "11:00");
        const checkInDateTime = new Date(`${checkIn}T${checkInTime24}:00`);
        const checkOutDateTime = new Date(`${checkOut}T${checkOutTime24}:00`);

        if (isNaN(checkInDateTime) || isNaN(checkOutDateTime)) {
            return ThrowError(res, 400, "Invalid date format");
        }

        if (checkInDateTime >= checkOutDateTime) {
            return ThrowError(res, 400, "Check-out must be after check-in");
        }

        if (Number(adults) < 1) {
            return ThrowError(res, 400, "At least 1 adult is required");
        }

        return res.status(200).json({
            success: true,
            msg: "Details validated successfully",
            data: {
                first_name,
                last_name,
                email,
                phone,
                checkIn: checkInDateTime,
                checkOut: checkOutDateTime,
                checkInTime: checkInTime24,
                checkOutTime: checkOutTime24,
                adults: Number(adults),
                children: Number(children) || 0
            }
        });

    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const getAvailableRoomTypes = async (req, res) => {
    try {
        const { checkIn, checkOut, checkInTime, checkOutTime, adults, children } = req.body;

        if (!checkIn || !checkOut || !adults) {
            return ThrowError(res, 400, "Check-in, check-out and adults are required");
        }

        const checkInTime24 = convertTo24Hour(checkInTime || "14:00");
        const checkOutTime24 = convertTo24Hour(checkOutTime || "11:00");
        const checkInDateTime = new Date(`${checkIn}T${checkInTime24}:00`);
        const checkOutDateTime = new Date(`${checkOut}T${checkOutTime24}:00`);

        if (checkInDateTime >= checkOutDateTime) {
            return ThrowError(res, 400, "Check-out must be after check-in");
        }

        const bookedRooms = await RoomReservation.find({
            status: { $nin: ["Cancelled"] },
            paymentStatus: "Paid",
            $or: [{ checkIn: { $lt: checkOutDateTime }, checkOut: { $gt: checkInDateTime } }]
        }).select("room");

        const bookedRoomIds = bookedRooms.map(b => b.room.toString());

        const roomTypes = await RoomType.find({ status: { $in: ["Available", "Active"] } });

        const result = await Promise.all(
            roomTypes.map(async (rt) => {
                const availableRooms = await Room.find({
                    roomType: rt._id,
                    status: "Available",
                    _id: { $nin: bookedRoomIds }
                });

                const billing = calculateBilling(
                    checkIn, checkOut,
                    checkInTime, checkOutTime,
                    rt.price_per_night
                );

                return {
                    _id: rt._id,
                    name: rt.name,
                    display_name: rt.display_name,
                    description: rt.description,
                    price_per_night: rt.price_per_night,
                    image_url: rt.image_url,
                    features: rt.features,
                    availableCount: availableRooms.length,
                    isAvailable: availableRooms.length > 0,
                    billingType: billing.billingType,
                    hours: billing.hours,
                    nights: billing.nights,
                    hourlyRate: billing.hourlyRate,
                    totalAmount: billing.totalAmount
                };
            })
        );

        return res.status(200).json({
            success: true,
            msg: "Room types fetched successfully",
            data: {
                roomTypes: result,
                checkIn: checkInDateTime,
                checkOut: checkOutDateTime,
                checkInTime: checkInTime24,
                checkOutTime: checkOutTime24,
                adults,
                children: children || 0
            }
        });

    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const getRoomsByType = async (req, res) => {
    try {
        const { roomTypeId, checkIn, checkOut, checkInTime, checkOutTime } = req.body;

        if (!roomTypeId || !checkIn || !checkOut) {
            return ThrowError(res, 400, "Room type, check-in and check-out are required");
        }

        if (!mongoose.Types.ObjectId.isValid(roomTypeId)) {
            return ThrowError(res, 400, "Invalid Room Type ID");
        }

        const checkInTime24 = convertTo24Hour(checkInTime || "14:00");
        const checkOutTime24 = convertTo24Hour(checkOutTime || "11:00");
        const checkInDateTime = new Date(`${checkIn}T${checkInTime24}:00`);
        const checkOutDateTime = new Date(`${checkOut}T${checkOutTime24}:00`);

        const bookedRooms = await RoomReservation.find({
            status: { $nin: ["Cancelled"] },
            paymentStatus: "Paid",
            $or: [{ checkIn: { $lt: checkOutDateTime }, checkOut: { $gt: checkInDateTime } }]
        }).select("room");

        const bookedRoomIds = bookedRooms.map(b => b.room.toString());

        const roomType = await RoomType.findById(roomTypeId);
        if (!roomType) return ThrowError(res, 404, "Room type not found");

        const availableRooms = await Room.find({
            roomType: roomTypeId,
            status: "Available",
            _id: { $nin: bookedRoomIds }
        });

        if (!availableRooms.length) {
            return res.status(200).json({
                success: false,
                msg: "No rooms available for selected dates",
                data: null
            });
        }

        const billing = calculateBilling(
            checkIn, checkOut,
            checkInTime, checkOutTime,
            roomType.price_per_night
        );

        return res.status(200).json({
            success: true,
            msg: "Rooms fetched successfully",
            data: {
                roomType,
                availableRooms,
                billingType: billing.billingType,
                hours: billing.hours,
                nights: billing.nights,
                hourlyRate: billing.hourlyRate,
                totalAmount: billing.totalAmount
            }
        });

    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const createPaymentIntent = async (req, res) => {
    try {
        const {
            first_name, last_name, email, phone,
            checkIn, checkOut, checkInTime, checkOutTime,
            adults, children, roomTypeId, roomId, specialRequest, userId
        } = req.body;

        if (!first_name || !last_name || !email || !phone ||
            !checkIn || !checkOut || !roomTypeId || !roomId) {
            return ThrowError(res, 400, "All required fields are missing");
        }

        if (!mongoose.Types.ObjectId.isValid(roomTypeId) || !mongoose.Types.ObjectId.isValid(roomId)) {
            return ThrowError(res, 400, "Invalid Room Type or Room ID");
        }

        const roomType = await RoomType.findById(roomTypeId);
        if (!roomType) return ThrowError(res, 404, "Room type not found");

        const room = await Room.findById(roomId);
        if (!room) return ThrowError(res, 404, "Room not found");

        const billing = calculateBilling(checkIn, checkOut, checkInTime, checkOutTime, roomType.price_per_night);

        if (billing.totalAmount === 0) {
            return ThrowError(res, 400, "Check-out time must be after check-in time");
        }

        let finalUserId = userId || req.user?._id;

        if (!finalUserId && email) {
            const user = await UserModel.findOne({ email: email.toLowerCase() });
            if (user) finalUserId = user._id;
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: billing.totalAmount * 100,
            currency: "inr",
            metadata: {
                first_name, last_name, email,
                roomId, roomTypeId,
                userId: finalUserId?.toString() || "",
                checkIn: checkIn.toString(),
                checkOut: checkOut.toString(),
                billingType: billing.billingType,
                hours: billing.hours.toString(),
                nights: billing.nights.toString()
            }
        });

        return res.status(200).json({
            success: true,
            msg: "Payment intent created",
            data: {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
                billingType: billing.billingType,
                hours: billing.hours,
                nights: billing.nights,
                hourlyRate: billing.hourlyRate,
                totalAmount: billing.totalAmount,
                roomType: roomType.display_name,
                room: room.roomNumber
            }
        });

    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const confirmBooking = async (req, res) => {
    try {
        const {
            first_name, last_name, email, phone,
            checkIn, checkOut, checkInTime, checkOutTime,
            adults, children, roomTypeId, roomId,
            specialRequest, paymentIntentId, userId
        } = req.body;

        if (!first_name || !last_name || !email || !phone ||
            !checkIn || !checkOut || !roomTypeId || !roomId || !paymentIntentId) {
            return ThrowError(res, 400, "All required fields are missing");
        }

        const roomType = await RoomType.findById(roomTypeId);
        if (!roomType) return ThrowError(res, 404, "Room type not found");

        const billing = calculateBilling(checkIn, checkOut, checkInTime, checkOutTime, roomType.price_per_night);

        const checkInTime24 = convertTo24Hour(checkInTime || "14:00");
        const checkOutTime24 = convertTo24Hour(checkOutTime || "11:00");
        const checkInDateTime = new Date(`${checkIn}T${checkInTime24}:00`);
        const checkOutDateTime = new Date(`${checkOut}T${checkOutTime24}:00`);

        let finalUserId = userId || req.user?._id;

        if (!finalUserId && email) {
            const user = await UserModel.findOne({ email: email.toLowerCase() });
            if (user) finalUserId = user._id;
        }

        const booking = await RoomReservation.create({
            first_name, last_name, email, phone,
            checkIn: checkInDateTime,
            checkOut: checkOutDateTime,
            checkInTime: checkInTime24,
            checkOutTime: checkOutTime24,
            adults: Number(adults),
            children: Number(children) || 0,
            roomType: roomTypeId,
            room: roomId,
            user: finalUserId,
            specialRequest: specialRequest || "",
            totalAmount: billing.totalAmount,
            advanceAmount: 10, // Fixed 10 USD advance payment
            nights: billing.nights || 1,
            paymentStatus: "Paid",
            paymentIntentId,
            status: "Confirmed"
        });

        await Room.findByIdAndUpdate(roomId, { status: "Occupied" });

        const populated = await RoomReservation.findById(booking._id)
            .populate("roomType", "display_name price_per_night")
            .populate("room", "roomNumber floor");

        return res.status(201).json({
            success: true,
            msg: "Booking confirmed successfully",
            data: {
                bookingRef: booking.bookingRef,
                guest: `${first_name} ${last_name}`,
                email,
                checkIn: checkInDateTime,
                checkOut: checkOutDateTime,
                checkInTime: checkInTime24,
                checkOutTime: checkOutTime24,
                billingType: billing.billingType,
                hours: billing.hours,
                nights: billing.nights,
                totalAmount: billing.totalAmount,
                room: populated.room,
                roomType: populated.roomType,
                status: booking.status,
                paymentStatus: booking.paymentStatus
            }
        });

    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
};
export const getReservationById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return ThrowError(res, 400, "Invalid Reservation ID");
        }

        const reservation = await RoomReservation.findById(id)
            .populate("roomType", "display_name price_per_night")
            .populate("room", "roomNumber floor");

        if (!reservation) return ThrowError(res, 404, "Reservation not found");

        return res.status(200).json({
            success: true,
            msg: "Reservation fetched successfully",
            data: {
                ...reservation._doc,
                checkInFormatted: formatDate(reservation.checkIn),
                checkOutFormatted: formatDate(reservation.checkOut),
                guest: `${reservation.first_name} ${reservation.last_name}`
            }
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const getReservations = async (req, res) => {
    try {
        const reservations = await RoomReservation.find({})
            .populate("roomType", "display_name price_per_night")
            .populate("room", "roomNumber floor")
            .sort({ createdAt: -1 });

        if (reservations.length === 0) {
            return sendBadRequestResponse(res, "No any Reservation found");
        }

        const formatted = reservations.map(r => ({
            ...r._doc,
            checkInFormatted: formatDate(r.checkIn),
            checkOutFormatted: formatDate(r.checkOut),
            guest: `${r.first_name} ${r.last_name}`
        }));

        return res.status(200).json({
            success: true,
            msg: "Reservations fetched successfully",
            data: formatted
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const searchReservations = async (req, res) => {
    try {
        const { search } = req.query;
        let roomQuery = {};
        let tableQuery = {};

        if (search) {
            const regex = new RegExp(search, "i");
            roomQuery = {
                $or: [
                    { bookingRef: regex },
                    { first_name: regex },
                    { last_name: regex }
                ]
            };
            tableQuery = {
                $or: [
                    { bookingRef: regex },
                    { guest_name: regex }
                ]
            };
        }

        const roomReservations = await RoomReservation.find(roomQuery)
            .populate("roomType", "display_name")
            .sort({ createdAt: -1 });

        const tableReservations = await TableReservation.find(tableQuery)
            .sort({ createdAt: -1 });


        const formattedRooms = roomReservations.map(r => ({
            id: r._id,
            reservation: r.bookingRef,
            guest: `${r.first_name} ${r.last_name}`,
            date: formatDate(r.checkIn),
            time: r.checkInTime,
            party: r.adults + (r.children || 0),
            type: "Room",
            status: r.status
        }));

        const formattedTables = tableReservations.map(t => ({
            id: t._id,
            reservation: t.bookingRef,
            guest: t.guest_name,
            date: formatDate(t.date),
            time: t.time,
            party: t.guests,
            type: "Table",
            status: t.status
        }));

        let combined = [...formattedRooms, ...formattedTables];


        if (search) {
            const s = search.toLowerCase();
            if (s === "room") combined = formattedRooms;
            else if (s === "table") combined = formattedTables;
        }

        combined.sort((a, b) => new Date(b.date) - new Date(a.date));

        return res.status(200).json({
            success: true,
            msg: "Search executed successfully",
            data: combined
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const updateReservationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const normalizedStatusMap = {
            "checkout": "Checked Out",
            "checked out": "Checked Out",
            "check out": "Checked Out",
            "checkin": "Checked In",
            "checked in": "Checked In",
            "check in": "Checked In",
            "no show": "No Show"
        };

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return ThrowError(res, 400, "Invalid Reservation ID");
        }

        if (!status) {
            return ThrowError(res, 400, "Status is required");
        }

        const normalizedStatus =
            normalizedStatusMap[String(status).trim().toLowerCase()] || status;
        const validStatuses = ["Confirmed", "Cancelled", "Checked In", "Checked Out", "No Show"];

        if (!validStatuses.includes(normalizedStatus)) {
            return ThrowError(res, 400, "Invalid reservation status");
        }

        const reservation = await RoomReservation.findById(id);
        if (!reservation) return ThrowError(res, 404, "Reservation not found");

        reservation.status = normalizedStatus;

        if (normalizedStatus === "Checked In") {
            await Room.findByIdAndUpdate(reservation.room, { status: "Occupied" });
        } else if (normalizedStatus === "Checked Out") {
            await Room.findByIdAndUpdate(reservation.room, {
                status: "Maintenance",
                cleanStatus: "In Progress",
                cleanedAt: null,
                assignedHousekeeper: null,
                lastUpdatedBy: null,
                lastUpdatedByName: ""
            });
        } else if (normalizedStatus === "Cancelled") {
            await Room.findByIdAndUpdate(reservation.room, {
                status: "Available",
                cleanStatus: "Done",
                cleanedAt: null,
                assignedHousekeeper: null,
                lastUpdatedBy: null,
                lastUpdatedByName: ""
            });
        }

        await reservation.save();

        return res.status(200).json({
            success: true,
            msg: "Reservation status updated",
            data: reservation
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getGuests = async (req, res) => {
    try {

        const reservations = await RoomReservation.find({ status: { $ne: "Cancelled" } });

        const guestMap = {};

        reservations.forEach(r => {
            const email = r.email.toLowerCase();
            if (!guestMap[email]) {
                guestMap[email] = {
                    name: `${r.first_name} ${r.last_name}`,
                    email: r.email,
                    phone: r.phone,
                    visitsMap: new Set()
                };
            }
            if (r.checkIn) {

                const dateKey = new Date(r.checkIn).toISOString().split('T')[0];
                guestMap[email].visitsMap.add(dateKey);
            }
        });

        const uniqueEmails = Object.keys(guestMap);
        const emailRegexes = uniqueEmails.map(email => new RegExp(`^${email.replace(/[-\/\\^$*+?.()|[\\]{}]/g, '\\\\$&')}$`, 'i'));
        const users = await UserModel.find({ email: { $in: emailRegexes } }).select("email img");
        const userImgMap = {};
        users.forEach(u => {
            if (u.img) userImgMap[u.email.toLowerCase()] = u.img;
        });

        const guests = Object.values(guestMap).map(g => ({
            name: g.name,
            email: g.email,
            phone: g.phone,
            visits: g.visitsMap.size,
            photo: userImgMap[g.email.toLowerCase()] || null
        }));


        guests.sort((a, b) => b.visits - a.visits);

        return res.status(200).json({
            success: true,
            count: guests.length,
            msg: "Guests fetched successfully",
            data: guests
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const searchGuests = async (req, res) => {
    try {
        const { search } = req.query;


        const reservations = await RoomReservation.find({ status: { $ne: "Cancelled" } });

        const guestMap = {};

        reservations.forEach(r => {
            const email = r.email.toLowerCase();
            const fullName = `${r.first_name} ${r.last_name}`;
            const phone = r.phone;

            if (search) {
                const regex = new RegExp(search, "i");
                if (!regex.test(fullName) && !regex.test(phone)) {
                    return;
                }
            }

            if (!guestMap[email]) {
                guestMap[email] = {
                    name: fullName,
                    email: r.email,
                    phone: phone,
                    visitsMap: new Set()
                };
            }
            if (r.checkIn) {
                const dateKey = new Date(r.checkIn).toISOString().split('T')[0];
                guestMap[email].visitsMap.add(dateKey);
            }
        });

        const uniqueEmails = Object.keys(guestMap);
        const emailRegexes = uniqueEmails.map(email => new RegExp(`^${email.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\\\$&')}$`, 'i'));
        const users = await UserModel.find({ email: { $in: emailRegexes } }).select("email img");
        const userImgMap = {};
        users.forEach(u => {
            if (u.img) userImgMap[u.email.toLowerCase()] = u.img;
        });

        const guests = Object.values(guestMap).map(g => ({
            name: g.name,
            email: g.email,
            phone: g.phone,
            visits: g.visitsMap.size,
            photo: userImgMap[g.email.toLowerCase()] || null
        }));

        guests.sort((a, b) => b.visits - a.visits);

        return res.status(200).json({
            success: true,
            count: guests.length,
            msg: "Guests searched successfully",
            data: guests
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getAdminReservations = async (req, res) => {
    try {
        const { search = "", type = "All" } = req.query;

        let tableReservations = [];
        let roomReservations = [];

        if (type === "All" || type === "Room") {
            const query = {};
            if (search) {
                const regex = new RegExp(search, "i")
                query.$or = [
                    { bookingRef: regex },
                    { first_name: regex },
                    { last_name: regex }
                ];
            }
            roomReservations = await RoomReservation.find(query).sort({ createdAt: -1 });
        }

        if (type === "All" || type === "Table") {
            const query = {};
            if (search) {
                const regex = new RegExp(search, "i");
                query.$or = [
                    { bookingRef: regex },
                    { guest_name: regex }
                ];
            }
            tableReservations = await TableReservation.find(query).sort({ createdAt: -1 });
        }

        const activeStatuses = ["Confirmed", "Pending", "Cancelled", "Checked In", "No Show"];

        const totalTable = await TableReservation.countDocuments({ status: { $in: activeStatuses } });
        const totalRoom = await RoomReservation.countDocuments({ status: { $in: activeStatuses } });

        const confirmedTable = await TableReservation.countDocuments({ status: "Confirmed" });
        const confirmedRoom = await RoomReservation.countDocuments({ status: "Confirmed" });

        const pendingTable = await TableReservation.countDocuments({ status: "Pending" });
        const pendingRoom = await RoomReservation.countDocuments({ status: "Pending" });

        const cancelledTable = await TableReservation.countDocuments({ status: "Cancelled" });
        const cancelledRoom = await RoomReservation.countDocuments({ status: "Cancelled" });

        res.status(200).json({
            success: true,
            data: {
                total: totalTable + totalRoom,
                confirmed: confirmedTable + confirmedRoom,
                pending: pendingTable + pendingRoom,
                cancelled: cancelledTable + cancelledRoom
            }
        });

    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
