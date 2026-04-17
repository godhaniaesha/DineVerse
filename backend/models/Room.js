import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true,
        unique: true
    },
    floor: {
        type: String,
        required: true
    },
    roomType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoomType',
        required: true
    },
    capacity_adults: {
        type: Number,
        required: true,
        default: 1
    },
    capacity_childs: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Available', 'Occupied', 'Reserved', 'Maintenance'],
        default: 'Available'
    },
    cleanStatus: {
        type: String,
        enum: ['Clean', 'Dirty', 'In Progress', 'Pending'],
        default: 'Pending'
    },
    assignedHousekeeper: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    cleanedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const Room = mongoose.model('Room', roomSchema);
export default Room;
