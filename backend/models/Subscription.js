import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    status: {
        type: String,
        enum: ['Active', 'Unsubscribed'],
        default: 'Active'
    },
    interests: {
        type: [String],
        enum: ['New Recipes', 'Events', "Chef's Notes", 'Bar Specials'],
        default: []
    }
}, {
    timestamps: true
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
