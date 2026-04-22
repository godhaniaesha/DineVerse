import mongoose from "mongoose";

const tableReservationSchema = new mongoose.Schema({
    bookingRef: { type: String, unique: true },
    guest_name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true },
    area: { type: String, enum: ["Restaurant", "Cafe", "Bar"], required: true },
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    occasion: { type: String },
    specialRequest: { type: String },
    advanceAmount: { type: Number, default: 10 },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
    status: { type: String, enum: ["Confirmed", "Cancelled", "Completed"], default: "Confirmed" },
    isDiscountApplied: { type: Boolean, default: false }
}, { timestamps: true });

tableReservationSchema.pre("save", async function () {
    if (!this.bookingRef) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let ref = "TBL-";
        for (let i = 0; i < 6; i++) {
            ref += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        this.bookingRef = ref;
    }
})

export const TableReservation = mongoose.model("TableReservation", tableReservationSchema);