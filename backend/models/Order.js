import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderID: { type: String, unique: true },
    tableId: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true },
    waiterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    customerName: { type: String },
    customerEmail: { type: String },
    reservationId: { type: mongoose.Schema.Types.ObjectId, ref: "TableReservation" },
    items: [{
        dishId: { type: mongoose.Schema.Types.ObjectId, ref: "Dish" },
        name: { type: String },
        quantity: { type: Number },
        price: { type: Number },
        status: {
            type: String,
            enum: ["Pending", "Accepted by Chef", "Preparing", "Ready", "Served / Delivered"],
            default: "Pending"
        },
        chefId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    }],
    totalAmount: { type: Number },
    status: { type: String, enum: ["Active", "Completed", "Cancelled"], default: "Active" },
    specialInstructions: { type: String },
    paymentMethod: { type: String },
    paymentIntentId: { type: String }
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);