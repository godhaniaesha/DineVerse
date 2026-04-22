import { TableReservation } from "../models/TableReservation.js";
import Table from "../models/Table.js";
import { ThrowError } from "../utils/Error.utils.js";
import { sendBadRequestResponse } from "../utils/Response.utils.js";
import mongoose from "mongoose";
import Stripe from "stripe";
import dotenv from "dotenv";
import UserModel from "../models/UserModel.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET);


const isValidDate = (dateString) => {
    const dr = new Date(dateString);
    return dr instanceof Date && !isNaN(dr);
};

export const getAvailableTablesByArea = async (req, res) => {
    try {
        const { area, date, time, guests } = req.body;


        if (!area || !date || !time) {
            return sendBadRequestResponse(res, "Area, Date, and Time are required");
        }

        if (!isValidDate(date)) {
            return sendBadRequestResponse(res, "Invalid date format");
        }

        const searchDate = new Date(date);
        searchDate.setHours(0, 0, 0, 0);


        const bookedReservations = await TableReservation.find({
            date: searchDate,
            time: time,
            status: { $in: ["Confirmed", "Arrived"] }
        }).select("table");

        const bookedTableIds = bookedReservations.map(b => b.table.toString());


        const query = {
            area: area,
            status: "Available",
            _id: { $nin: bookedTableIds }
        };

        const availableTables = await Table.find(query).sort({ capacity: 1, tableNo: 1 });
        const guestCount = Number(guests) || 0;
        const tablesWithMatchInfo = availableTables.map((table) => ({
            ...table.toObject(),
            capacityMatch: guestCount ? table.capacity >= guestCount : true,
            capacityGap: guestCount ? table.capacity - guestCount : 0
        }));

        return res.status(200).json({
            success: true,
            count: tablesWithMatchInfo.length,
            msg: `Available tables in ${area} for ${time} fetched successfully`,
            data: tablesWithMatchInfo
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const createTablePaymentIntent = async (req, res) => {
    try {
        const { guest_name, email, userId } = req.body;

        if (!guest_name || !email) {
            return sendBadRequestResponse(res, "Guest name and email are required for payment");
        }

        const amount = 10;

        let finalUserId = userId || req.user?._id;

        if (!finalUserId && email) {
            const user = await UserModel.findOne({ email: email.toLowerCase() });
            if (user) finalUserId = user._id;
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: "usd",
            description: `Table reservation advance for ${guest_name}`,
            metadata: { 
                guest_name, 
                email,
                userId: finalUserId?.toString() || ""
            },
            payment_method_types: ["card"],
        });

        return res.status(200).json({
            success: true,
            msg: "Table payment intent created",
            data: {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
                advanceAmount: amount
            }
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const confirmTableBooking = async (req, res) => {
    try {
        const {
            guest_name, email, phone, date, time,
            guests, area, tableId, occasion,
            specialRequest, paymentIntentId, userId
        } = req.body;

        if (!guest_name || !email || !phone || !date || !time || !tableId || !paymentIntentId) {
            return sendBadRequestResponse(res, "Missing mandatory booking details");
        }


        const table = await Table.findById(tableId);
        if (!table) return sendBadRequestResponse(res, "Table not found");

        if (table.area !== area) {
            return sendBadRequestResponse(res, `This table belongs to the ${table.area} area, not ${area}. Please select a valid table.`);
        }


        const searchDate = new Date(date);
        searchDate.setHours(0, 0, 0, 0);

        const isAlreadyBooked = await TableReservation.findOne({
            table: tableId,
            date: searchDate,
            time: time,
            status: "Confirmed"
        });

        if (isAlreadyBooked) {
            return ThrowError(res, 400, "This table has just been booked by someone else.");
        }

        let finalUserId = userId || req.user?._id;

        if (!finalUserId && email) {
            const user = await UserModel.findOne({ email: email.toLowerCase() });
            if (user) finalUserId = user._id;
        }

        const booking = await TableReservation.create({
            guest_name, email, phone,
            date: searchDate, time,
            guests: Number(guests) || 1,
            area, table: tableId,
            user: finalUserId || null,
            occasion: occasion || "Other",
            specialRequest: specialRequest || "",
            advanceAmount: 10,
            paymentStatus: "Paid",
            paymentIntentId,
            status: "Confirmed"
        });

        await Table.findByIdAndUpdate(tableId, { status: "Occupied" });

        const populatedBooking = await TableReservation.findById(booking._id)
            .populate('table', 'tableNo area floor')
            .populate('user', 'full_name email');

        return res.status(201).json({ success: true, msg: "Table Reserved Successfully", data: populatedBooking });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const updateTableReservationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, waiter } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Reservation ID");
        }

        const validStatuses = ["Confirmed", "Cancelled", "Arrived", "Completed"];
        if (!validStatuses.includes(status)) {
            return sendBadRequestResponse(res, "Invalid status value");
        }

        const updateData = { status };
        if (waiter) updateData.waiter = waiter;

        const reservation = await TableReservation.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate('table', 'tableNo area')
         .populate('user', 'full_name email');

        if (!reservation) return ThrowError(res, 404, "Reservation not found");

        return res.status(200).json({
            success: true,
            msg: `Reservation status updated to ${status}`,
            data: reservation
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getTableReservationsByDate = async (req, res) => {
    try {
        const { date } = req.query;
        let query = {};

        if (date && isValidDate(date)) {
            const searchDate = new Date(date);
            searchDate.setHours(0, 0, 0, 0);
            query.date = searchDate;
        }

        const reservations = await TableReservation.find(query)
            .populate('table', 'tableNo area')
            .populate('user', 'full_name email')
            .sort({ time: 1 });

        return res.status(200).json({
            success: true,
            count: reservations.length,
            data: reservations
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};