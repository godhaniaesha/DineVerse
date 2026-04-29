import { Order } from "../models/Order.js";
import Table from "../models/Table.js";
import { TableReservation } from "../models/TableReservation.js";
import Dish from "../models/Dish.js";
import { ThrowError } from "../utils/Error.utils.js";
import { sendBadRequestResponse } from "../utils/Response.utils.js";
import mongoose from "mongoose";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET);

export const createOrder = async (req, res) => {
    try {
        const { tableId, customerName, customerEmail, items, specialInstructions } = req.body;

        if (!tableId || !items || items.length === 0) {
            return sendBadRequestResponse(res, "Table ID and items are required");
        }

        if (!mongoose.Types.ObjectId.isValid(tableId)) {
            return sendBadRequestResponse(res, "Invalid Table ID");
        }

        const table = await Table.findById(tableId);
        if (!table) {
            return sendBadRequestResponse(res, "Table not found");
        }

        const areaPrefix = table.area ? table.area.toUpperCase() : "ORD";

        let order = await Order.findOne({ tableId, status: "Active" });

        let finalCustomerName = customerName || "Guest";
        let finalCustomerEmail = customerEmail || "";

        let activeReservationId = null;

        if (!finalCustomerEmail) {
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);
            const endOfToday = new Date();
            endOfToday.setHours(23, 59, 59, 999);
            const reservation = await TableReservation.findOne({
                table: tableId,
                status: "Confirmed",
                paymentStatus: "Paid",
                date: { $gte: startOfToday, $lte: endOfToday }
            });
            if (reservation) {
                finalCustomerName = reservation.guest_name;
                finalCustomerEmail = reservation.email;
                activeReservationId = reservation._id;
            }
        }

        const newItems = items.map(item => ({
            dishId: item.dishId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            status: "Pending"
        }));

        const additionalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        if (order) {
            order.items.push(...newItems);
            order.totalAmount += additionalAmount;
            if (specialInstructions) order.specialInstructions += ` | ${specialInstructions}`;
            if (finalCustomerEmail) order.customerEmail = finalCustomerEmail;
            if (finalCustomerName !== "Guest") order.customerName = finalCustomerName;
            if (activeReservationId) order.reservationId = activeReservationId;
            await order.save();
        } else {
            order = await Order.create({
                orderID: `${areaPrefix}-${Math.floor(100000 + Math.random() * 900000)}`,
                tableId,
                waiterId: req.user._id,
                customerName: finalCustomerName,
                customerEmail: finalCustomerEmail,
                reservationId: activeReservationId,
                items: newItems,
                totalAmount: additionalAmount,
                specialInstructions,
                status: "Active"
            });
            await Table.findByIdAndUpdate(tableId, { status: "Occupied" });
        }

        res.status(201).json({ success: true, msg: "Items added to kitchen queue", data: order });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const createBillingPaymentIntent = async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return sendBadRequestResponse(res, "Invalid Order ID");
        }

        const order = await Order.findById(orderId);
        if (!order) return ThrowError(res, 404, "Order not found");
        if (order.status === "Completed") return ThrowError(res, 400, "Order already paid");

        const hasUnservedItems = order.items.some(item => item.status !== "Served / Delivered");
        if (hasUnservedItems) {
            return sendBadRequestResponse(res, "Cannot process payment. All items must be Served / Delivered first.");
        }

        let finalAmount = order.totalAmount;
        let discountApplied = 0;
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        const reservation = await TableReservation.findOne({
            table: order.tableId,
            date: { $gte: startOfToday, $lte: endOfToday },
            paymentStatus: "Paid",
            isDiscountApplied: false
        });

        if (reservation) {
            discountApplied = reservation.advanceAmount;
            finalAmount = Math.max(0, finalAmount - discountApplied);
        }

        let clientSecret = null;
        let paymentIntentId = null;
        if (finalAmount > 0) {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(finalAmount * 100),
                currency: "inr",
                metadata: { orderId: order._id.toString() }
            });
            clientSecret = paymentIntent.client_secret;
            paymentIntentId = paymentIntent.id;
        }

        res.status(200).json({
            success: true,
            data: {
                paymentIntentId,
                clientSecret,
                originalAmount: order.totalAmount,
                discount: discountApplied,
                payableAmount: finalAmount,
                orderRef: order.orderID
            }
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const confirmBillingAndCheckout = async (req, res) => {
    try {
        const { orderId } = req.params;

        const { paymentIntentId, paymentMethod, customerEmail } = req.body;

        const order = await Order.findById(orderId);
        if (!order) return ThrowError(res, 404, "Order not found");

        let finalPayableAmount = order.totalAmount;
        let discountApplied = 0;

        const reservation = await TableReservation.findOneAndUpdate(
            {
                table: order.tableId,
                isDiscountApplied: false,
                paymentStatus: "Paid"
            },
            { isDiscountApplied: true, status: "Completed" }
        );

        if (reservation) {
            discountApplied = reservation.advanceAmount;
            finalPayableAmount = Math.max(0, order.totalAmount - discountApplied);
            order.customerEmail = reservation.email;
            order.reservationId = reservation._id;
        } else if (customerEmail) {
            order.customerEmail = customerEmail;
        }
        order.status = "Completed";
        order.totalAmount = finalPayableAmount;
        order.paymentMethod = paymentMethod || "Online";




        order.items.forEach(item => { item.status = "Served / Delivered"; });

        await order.save();

        await Table.findByIdAndUpdate(order.tableId, { status: "Available" });

        res.status(200).json({
            success: true,
            msg: "Checkout successful",
            data: order
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getKitchenQueue = async (req, res) => {
    try {
        const orders = await Order.find({ status: "Active" })
            .populate("tableId", "tableNo area")
            .populate("waiterId", "full_name")
            .sort({ createdAt: 1 });
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const acceptDish = async (req, res) => {
    try {
        const { orderId, dishItemId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(dishItemId)) {
            return sendBadRequestResponse(res, "Invalid Order or Dish Item ID");
        }
        const order = await Order.findOneAndUpdate(
            { _id: orderId, items: { $elemMatch: { _id: dishItemId, status: "Pending" } } },
            { $set: { "items.$.status": "Preparing", "items.$.chefId": req.user._id } },
            { new: true }
        );
        if (!order) return sendBadRequestResponse(res, "Dish already taken or not found");
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const markDishReady = async (req, res) => {
    try {
        const { orderId, dishItemId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(dishItemId)) {
            return sendBadRequestResponse(res, "Invalid Order or Dish Item ID");
        }

        const oId = new mongoose.Types.ObjectId(orderId);
        const dId = new mongoose.Types.ObjectId(dishItemId);

        const order = await Order.findOneAndUpdate(
            {
                _id: oId,
                "items": {
                    $elemMatch: {
                        "_id": dId,
                        "chefId": req.user._id
                    }
                }
            },
            {
                $set: { "items.$.status": "Ready" }
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                msg: "Dish not found, status changed, or you are not the assigned chef"
            });
        }

        res.status(200).json({ success: true, msg: "Status updated successfully", data: order });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const updateItemStatus = async (req, res) => {
    try {
        const { orderId, dishItemId } = req.params;
        const { status, chefId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(dishItemId)) {
            return sendBadRequestResponse(res, "Invalid Order or Dish Item ID");
        }


        const validStatuses = ["Pending", "Accepted by Chef", "Preparing", "Ready", "Served / Delivered"];
        if (!validStatuses.includes(status)) {
            return sendBadRequestResponse(res, "Invalid status");
        }

        const updateField = { "items.$.status": status };


        if (chefId) updateField["items.$.chefId"] = chefId;


        const order = await Order.findOneAndUpdate(
            { _id: orderId, "items._id": dishItemId },
            { $set: updateField },
            { new: true }
        );

        if (!order) return ThrowError(res, 404, "Order or Item not found");

        res.status(200).json({
            success: true,
            msg: `Item status updated to ${status}`,
            data: order
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getAllOrdersForAdmin = async (req, res) => {
    try {
        const { status, area } = req.query;
        let query = {};


        if (status && status !== 'All') query.status = status;

        const populateMatch = (area && area !== 'All') ? { area: new RegExp(area, "i") } : {};

        const orders = await Order.find(query)
            .populate({ path: 'tableId', match: populateMatch, select: 'tableNo area' })
            .populate('waiterId', 'full_name')
            .sort({ createdAt: -1 });

        const filteredOrders = orders.filter(o => o.tableId !== null);

        res.status(200).json({ success: true, count: filteredOrders.length, data: filteredOrders });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getBillingOrders = async (req, res) => {
    try {
        const { area } = req.query;
        const populateMatch = (area && area !== 'All') ? { area: new RegExp(area, "i") } : {};

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        let statusQuery = { status: "Active" };
        if (req.user && (req.user.role === "Super Admin" || req.user.role === "Manager")) {
            statusQuery = {
                $or: [
                    { status: "Active" },
                    { status: "Completed" }
                ]
            };
        }

        const orders = await Order.find(statusQuery)
            .populate({ path: 'tableId', match: populateMatch, select: 'tableNo area' });

        const validOrders = orders.filter(o => o.tableId !== null);

        const groups = {};

        validOrders.forEach(order => {
            const tableKey = order.tableId.tableNo;
            const areaKey = order.tableId.area;
            const groupKey = `${areaKey}-${tableKey}`;

            if (!groups[groupKey]) {
                groups[groupKey] = {
                    tableId: order.tableId._id,
                    table: tableKey,
                    area: areaKey,
                    ordersCount: 0,
                    total: 0,
                    orders: []
                };
            }
            groups[groupKey].ordersCount += 1;
            groups[groupKey].total += order.totalAmount;


            const itemsString = order.items.map(i => `${i.name} x${i.quantity}`).join(', ');

            groups[groupKey].orders.push({
                _id: order._id,
                id: order.orderID,
                itemsCount: order.items.length,
                total: order.totalAmount,
                status: order.status,
                items: itemsString
            });
        });

        const tableWiseData = Object.values(groups);

        res.status(200).json({
            success: true,
            count: tableWiseData.length,
            data: tableWiseData
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const { area } = req.query;

        let matchStage = {};
        if (area) {
            matchStage.area = new RegExp(area, "i");
        }

        const stats = await Dish.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalItems: { $sum: 1 },
                    availableNow: {
                        $sum: { $cond: [{ $eq: ["$status", "available"] }, 1, 0] }
                    },
                    averagePrice: { $avg: "$price" },
                    featuredPicks: {
                        $sum: { $cond: [{ $and: [{ $ne: ["$img", null] }, { $ne: ["$img", ""] }] }, 1, 0] }
                    }
                }
            }
        ]);

        const dashboardData = stats.length > 0 ? {
            totalItems: stats[0].totalItems,
            availableNow: stats[0].availableNow,
            featuredPicks: Math.min(stats[0].featuredPicks, 5),
            averagePrice: Math.round(stats[0].averagePrice || 0)
        } : {
            totalItems: 0,
            availableNow: 0,
            featuredPicks: 0,
            averagePrice: 0
        };

        res.status(200).json({ success: true, msg: "Stats fetched successfully", data: dashboardData });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getChefQueue = async (req, res) => {
    try {


        const orders = await Order.find({ status: "Active" })
            .populate("tableId", "tableNo area")
            .populate("waiterId", "full_name")
            .sort({ createdAt: 1 });
        
        console.log("Fetched Orders for Chef Queue:", orders);
        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getWaiterActiveOrders = async (req, res) => {
    try {

        const orders = await Order.find({
            waiterId: req.user._id,
            status: "Active"
        })
            .populate("tableId", "tableNo area")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getCompletedPayments = async (req, res) => {
    try {
        const { area, paymentMethod } = req.query;
        let query = { status: "Completed" };

        if (paymentMethod && paymentMethod !== 'All') {
            query.paymentMethod = paymentMethod;
        }

        const populateMatch = (area && area !== 'All') ? { area: new RegExp(area, "i") } : {};

        const orders = await Order.find(query)
            .populate({ path: 'tableId', match: populateMatch, select: 'tableNo area' })
            .populate("waiterId", "full_name")
            .sort({ updatedAt: -1 });

        const filteredOrders = orders.filter(o => o.tableId !== null);

        res.status(200).json({ success: true, count: filteredOrders.length, data: filteredOrders });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};