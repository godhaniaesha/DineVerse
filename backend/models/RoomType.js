import mongoose from 'mongoose';

const roomTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    display_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    price_per_night: {
        type: Number,
        required: true
    },
    image_url: {
        type: String,
    },
    features: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Available'],
        default: 'Active'
    }
}, {
    timestamps: true
});

const RoomType = mongoose.model('RoomType', roomTypeSchema);
export default RoomType;
