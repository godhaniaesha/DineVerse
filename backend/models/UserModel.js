import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Super Admin', 'Manager', 'Housekeeping', 'Cafe Waiter', 'Res Waiter', 'Bar Waiter', 'Chef', 'User'],
        default: 'User'
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    img: {
        type: String,
    },
    department: { type: String },
    cuisineSpecialization: { type: [String] },
    area: { type: [String], enum: ['Restaurant', 'Cafe', 'Bar', 'All'], default: ['All'] },
    addedBy: { type: String },
    resetOTP: { type: String, default: null },
    resetOTPExpiry: { type: Date, default: null }
}, {
    timestamps: true
});

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel = mongoose.model('User', userSchema);
export default UserModel;