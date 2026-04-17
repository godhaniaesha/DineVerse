import mongoose from 'mongoose';

const cuisineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    img: {
        type: String,
    },
    description: {
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

const Cuisine = mongoose.model('Cuisine', cuisineSchema);
export default Cuisine;
