import mongoose from 'mongoose';

const dishSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    img: {
        type: String,
    },
    short_des: {
        type: String,
    },
    des: {
        type: String,
    },
    cat_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    cuisineId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cuisine',
        required: true
    },
    mealType: {
        type: String,
        enum: ["Veg", "Non-Veg"],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    prepTime: {
        type: String,

    },
    ingredients: {
        type: [String],
    },
    note: {
        type: String,
    },
    area: [{
        type: String,
        enum: ["Restaurant", "Cafe", "Bar"],
        required: true
    }],

    chef: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],

    status: {
        type: String,
        enum: ["available", "unavailable"],
        default: 'available'
    }
}, {
    timestamps: true
});

const Dish = mongoose.model('Dish', dishSchema);
export default Dish;