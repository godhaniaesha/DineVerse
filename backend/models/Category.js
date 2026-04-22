import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    area: [{
        type: String,
        enum: ['Restaurant', 'Cafe', 'Bar'],
        required: true
    }],
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
}, {
    timestamps: true
});

const Category = mongoose.model('Category', categorySchema);
export default Category;