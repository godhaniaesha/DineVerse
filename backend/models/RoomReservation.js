import mongoose from "mongoose";

const roomReservationSchema = new mongoose.Schema(
    {
        bookingRef: {
            type: String,
            unique: true
        },
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        checkIn: { type: Date, required: true },
        checkOut: { type: Date, required: true },
        checkInTime: { type: String, default: "14:00" },
        checkOutTime: { type: String, default: "11:00" },
        adults: { type: Number, required: true, default: 1 },
        children: { type: Number, default: 0 },
        roomType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RoomType",
            required: true
        },
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        specialRequest: { type: String, default: "" },
        totalAmount: { type: Number, required: true },
        nights: { type: Number, required: true },
        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed", "Refunded"],
            default: "Pending"
        },
        paymentIntentId: { type: String, default: null },
        status: {
            type: String,
            enum: ["Confirmed", "Cancelled", "Checked In", "Checked Out", "No Show"],
            default: "Confirmed"
        }
    },
    { timestamps: true }
);
roomReservationSchema.pre("save", async function () {
    if (!this.bookingRef) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let ref = "RM-";
        for (let i = 0; i < 6; i++) {
            ref += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        this.bookingRef = ref;
    }
});

export const RoomReservation = mongoose.model("RoomReservation", roomReservationSchema);