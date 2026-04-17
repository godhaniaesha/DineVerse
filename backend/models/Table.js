import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
    tableNo: {
        type: String,
        required: true,
        unique: true
    },
    capacity: {
        type: Number,
        required: true
    },
    area: {
        type: String,
        enum: ["Restaurant", "Cafe", "Bar"],
        required: true
    },
    status: {
        type: String,
        enum: ['Available', 'Occupied', 'Reserved'],
        default: 'Available'
    }
}, {
    timestamps: true
});

const Table = mongoose.model('Table', tableSchema);
export default Table;