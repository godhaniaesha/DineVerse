import { RoomReservation } from "../models/RoomReservation.js";
import { TableReservation } from "../models/TableReservation.js";
import { Order } from "../models/Order.js";
import { ThrowError } from "../utils/Error.utils.js";

export const getUserBookings = async (req, res) => {
    try {
        const email = req.user.email;
        if (!email) {
            return ThrowError(res, 400, "User email not found");
        }

        const tableReservations = await TableReservation.find({ email })
            .select("area date time status bookingRef")
            .sort({ date: -1 });

        const roomReservations = await RoomReservation.find({ email })
            .select("checkIn checkOut status bookingRef")
            .sort({ checkIn: -1 });

        const formattedBookings = [
            ...tableReservations.map(tr => ({
                id: tr._id,
                service: tr.area === "Bar" ? "The Bar" : tr.area === "Cafe" ? "The Café" : "The Restaurant",
                date: tr.date,
                time: tr.time,
                status: tr.status,
                bookingRef: tr.bookingRef,
                type: "Table"
            })),
            ...roomReservations.map(rr => ({
                id: rr._id,
                service: "Room Booking",
                date: rr.checkIn,
                time: "14:00",
                status: rr.status,
                bookingRef: rr.bookingRef,
                type: "Room"
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
                r.table && o.tableId && r.table._id.toString() === o.tableId._id.toString() &&
                r.status === "Completed" && r.isDiscountApplied === true
            );

            const advance = usedReservation ? usedReservation.advanceAmount : 0;

            combinedHistory.push({
                id: o._id,
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
                new Date(ch.date).getDate() === new Date(r.date).getDate() &&

                ch.advanceAmount === r.advanceAmount &&
                ch.type === "Booking & Order"
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