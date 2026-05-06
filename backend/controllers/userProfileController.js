import { RoomReservation } from "../models/RoomReservation.js";
import { TableReservation } from "../models/TableReservation.js";
import { Order } from "../models/Order.js";
import { ThrowError } from "../utils/Error.utils.js";

export const getUserBookings = async (req, res) => {
    try {
        const userId = req.user._id;
        const email = req.user.email;

        const emailRegex =
            typeof email === "string" && email.trim()
                ? new RegExp(`^${email.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i")
                : null;

        const ownerFilter = emailRegex
            ? { $or: [{ user: userId }, { email: emailRegex }] }
            : { user: userId };

        const tableReservations = await TableReservation.find(ownerFilter)
            .populate("table", "tableNo area floor")
            .sort({ date: -1 });

        const roomReservations = await RoomReservation.find(ownerFilter)
            .populate("roomType", "display_name price_per_night")
            .populate("room", "roomNumber floor")
            .sort({ checkIn: -1 });

        const formattedBookings = [
            ...tableReservations.map(tr => ({
                id: tr._id,
                service: tr.area === "Bar" ? "The Bar" : tr.area === "Cafe" ? "The Café" : "The Restaurant",
                date: tr.date,
                time: tr.time,
                status: tr.status,
                bookingRef: tr.bookingRef,
                type: "Table",
                guests: tr.guests,
                adults: tr.guests,
                children: 0,
                tableName: tr.table?.tableNo ? `Table ${tr.table.tableNo}` : "Premium Table",
                floor: tr.table?.floor || "Ground Floor",
                totalAmount: tr.advanceAmount || 0,
                specialRequests: tr.specialRequest || ""
            })),
            ...roomReservations.map(rr => ({
                id: rr._id,
                service: "Room Booking",
                date: rr.checkIn,
                checkOut: rr.checkOut,
                time: rr.checkInTime || "14:00",
                checkOutTime: rr.checkOutTime || "11:00",
                status: rr.status,
                bookingRef: rr.bookingRef,
                type: "Room",
                adults: rr.adults,
                children: rr.children,
                roomNo: rr.room?.roomNumber || "Suite",
                roomType: rr.roomType?.display_name || "Luxury Suite",
                totalAmount: rr.totalAmount,
                advanceAmount: rr.advanceAmount || 0,
                specialRequests: rr.specialRequest || ""
            }))
        ];

        formattedBookings.sort((a, b) => new Date(b.date) - new Date(a.date));

        return res.status(200).json({
            success: true,
            msg: "Bookings fetched successfully",
            data: formattedBookings
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getUserBillingHistory = async (req, res) => {
    try {
        const userEmail = req.user.email;

        const reservations = await TableReservation.find({
            email: userEmail,
            paymentStatus: "Paid"
        }).populate('table', 'area tableNo');

        const orders = await Order.find({
            customerEmail: userEmail,
            status: "Completed"
        }).populate('tableId', 'area tableNo');

        const combinedHistory = [];

        orders.forEach(o => {
            const usedReservation = reservations.find(r =>
                (o.reservationId && r._id.toString() === o.reservationId.toString()) ||
                (!o.reservationId && r.table && o.tableId && r.table._id.toString() === o.tableId._id.toString() && r.status === "Completed" && r.isDiscountApplied === true)
            );

            const advance = usedReservation ? usedReservation.advanceAmount : 0;

            combinedHistory.push({
                id: o._id,
                reservationId: usedReservation ? usedReservation._id : null,
                date: o.createdAt,
                service: o.tableId?.area || "Restaurant",
                transactionId: o.orderID,
                advanceAmount: advance,
                amount: o.totalAmount,
                totalAmount: o.totalAmount + advance,
                type: usedReservation ? "Booking & Order" : "Walk-in Order"
            });
        });

        reservations.forEach(r => {
            const isMerged = combinedHistory.some(ch =>
                (ch.reservationId && ch.reservationId.toString() === r._id.toString()) ||
                (!ch.reservationId && new Date(ch.date).toDateString() === new Date(r.date).toDateString() && ch.advanceAmount === r.advanceAmount && ch.type === "Booking & Order")
            );

            if (!isMerged) {
                combinedHistory.push({
                    id: r._id,
                    date: r.date,
                    service: r.table?.area || "Restaurant",
                    transactionId: r.bookingRef || "N/A",
                    advanceAmount: r.advanceAmount,
                    amount: 0,
                    totalAmount: r.advanceAmount,
                    type: "Table Advance"
                });
            }
        });

        combinedHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.status(200).json({
            success: true,
            msg: "Billing history fetched successfully",
            data: combinedHistory
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};