import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    area: {
        type: String,
        enum: ["Restaurant", "Cafe", "Bar"],
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    message: {
        type: String,
        required: true
    },
    tags: {
        type: String
    },
    profession: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// One user can only review a particular area once
reviewSchema.index({ user: 1, area: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
