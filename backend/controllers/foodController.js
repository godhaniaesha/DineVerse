import Category from '../models/Category.js';
import Dish from '../models/Dish.js';
import Cuisine from '../models/Cuisine.js';
import { ThrowError } from '../utils/Error.utils.js';
import { sendBadRequestResponse } from '../utils/Response.utils.js';
import { uploadFile, deleteFileFromS3 } from '../utils/uploadFile.utils.js';
import mongoose from 'mongoose';
import UserModel from '../models/UserModel.js';

export const addCategory = async (req, res) => {
    try {
        const { name, area, status } = req.body;

        if (!name || !area) {
            return sendBadRequestResponse(res, "Name and area are required");
        }

        let img = "";
        if (req.file) {
            const uploadResult = await uploadFile(req.file);
            img = uploadResult.url;
        }

        let parsedArea = [];
        if (area) {
            try {
                parsedArea = JSON.parse(area);
            } catch (e) {
                parsedArea = [area];
            }
        }

        const category = await Category.create({
            name,
            img,
            area: parsedArea,
            status: status || 'Active'
        });

        res.status(201).json({
            success: true,
            msg: "Category added successfully",
            data: category
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json({
            success: true,
            msg: "Categories fetched successfully",
            data: categories
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const searchCategories = async (req, res) => {
    try {
        const { search, area, cuisine } = req.query;
        let query = {};

        if (search) {
            const regex = new RegExp(search, 'i');

            const matchedCuisines = await Cuisine.find({ name: regex });
            const cuisineIds = matchedCuisines.map(c => c._id);

            query.$or = [
                { name: regex },
                { area: regex }
            ];
        }

        if (area && area !== "All" && area !== "None") {
            query.area = { $in: [new RegExp(area, "i")] };
        }

        const categories = await Category.find(query);

        res.status(200).json({
            success: true,
            msg: "Categories searched successfully",
            data: categories
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Category ID format");
        }

        const category = await Category.findById(id);
        if (!category) {
            return ThrowError(res, 404, "Category not found");
        }

        res.status(200).json({
            success: true,
            msg: "Category fetched successfully",
            data: category
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, area, status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Category ID format");
        }

        const category = await Category.findById(id);
        if (!category) {
            return ThrowError(res, 404, "Category not found");
        }

        if (req.file) {
            if (category.img) {
                await deleteFileFromS3(category.img);
            }
            const uploadResult = await uploadFile(req.file);
            category.img = uploadResult.url;
        }

        if (area) {
            try {
                category.area = JSON.parse(area);
            } catch (e) {
                category.area = [area];
            }
        }

        category.name = name || category.name;
        category.status = status || category.status;

        const updatedCategory = await category.save();

        res.status(200).json({
            success: true,
            msg: "Category updated successfully",
            data: updatedCategory
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Category ID format");
        }

        const category = await Category.findById(id);
        if (!category) {
            return ThrowError(res, 404, "Category not found");
        }
        const dishesCount = await Dish.countDocuments({ cat_id: id });
        if (dishesCount > 0) {
            return sendBadRequestResponse(res, `Cannot delete category. ${dishesCount} dishes belong to it.`);
        }

        if (category.img) {
            await deleteFileFromS3(category.img);
        }

        await category.deleteOne();
        res.status(200).json({
            success: true,
            msg: "Category deleted successfully",
            data: category
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const addDish = async (req, res) => {
    try {
        const {
            name, short_des, des, cat_id, cuisineId,
            mealType, price, prepTime, ingredients,
            note, area, chef, status
        } = req.body;

        if (!name || !cat_id || !price || !cuisineId || !mealType || !area || !chef) {
            return sendBadRequestResponse(res, "Required fields are missing");
        }

        if (!mongoose.Types.ObjectId.isValid(cuisineId)) {
            return sendBadRequestResponse(res, "Invalid Cuisine ID format");
        }

        const cuisineExists = await Cuisine.findById(cuisineId);
        if (!cuisineExists) {
            return ThrowError(res, 404, "Cuisine not found");
        }

        if (!mongoose.Types.ObjectId.isValid(cat_id)) {
            return sendBadRequestResponse(res, "Invalid Category ID format");
        }

        const categoryExists = await Category.findById(cat_id);
        if (!categoryExists) {
            return ThrowError(res, 404, "Category not found");
        }


        let chefIds = [];

        if (typeof chef === "string") {
            try {
                const parsed = JSON.parse(chef);
                chefIds = Array.isArray(parsed) ? parsed : [parsed];
            } catch {
                chefIds = chef.split(",").map(id => id.trim());
            }
        } else if (Array.isArray(chef)) {
            chefIds = chef;
        }

        const validChefs = [];

        for (let id of chefIds) {
            if (!mongoose.Types.ObjectId.isValid(id)) continue;

            const user = await UserModel.findById(id).catch(() => null);
            if (user && user.role === "Chef") {
                validChefs.push(user._id);
            }
        }

        if (!validChefs.length) {
            return sendBadRequestResponse(res, "Valid chefs not found");
        }


        let parsedArea = [];
        if (typeof area === "string") {
            try {
                parsedArea = JSON.parse(area);
            } catch {
                parsedArea = area.split(",");
            }
        } else {
            parsedArea = area;
        }

        parsedArea = parsedArea.map(a => {
            const val = a.trim().toLowerCase();
            if (val === "restaurant") return "Restaurant";
            if (val === "cafe") return "Cafe";
            if (val === "bar") return "Bar";
        }).filter(Boolean);

        if (!parsedArea.length) {
            return sendBadRequestResponse(res, "Invalid area");
        }


        let ingredientArray = [];
        if (ingredients) {
            ingredientArray = String(ingredients)
                .replace(/[\[\]"]/g, "")
                .split(",")
                .map(i => i.trim())
                .filter(Boolean);
        }

        // ✅ IMAGE
        let img = "";
        if (req.file) {
            const uploadResult = await uploadFile(req.file);
            img = uploadResult.url;
        }

        const dish = await Dish.create({
            name,
            img,
            short_des,
            des,
            cat_id,
            cuisineId,
            mealType,
            price: Number(price),
            prepTime,
            ingredients: ingredientArray,
            note: note || "",
            area: parsedArea,
            chef: validChefs,
            status: status || "available"
        });

        return res.status(201).json({
            success: true,
            msg: "Dish added successfully",
            data: dish
        });

    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getDishes = async (req, res) => {
    try {
        const dishes = await Dish.find({})
            .populate('cat_id', 'name')
            .populate('cuisineId', 'name')
            .populate('chef', 'full_name');

        res.status(200).json({
            success: true,
            msg: "Dishes fetched successfully",
            data: dishes
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const searchDishes = async (req, res) => {
    try {
        const { search, category, cuisineId, area } = req.query;
        let query = {};

        if (search) {
            const regex = new RegExp(search, 'i');
            query.$or = [
                { name: regex },
                { short_des: regex },
                { des: regex },
                { area: regex }
            ];
        }

        if (category && category !== "All" && category !== "None") {
            const cat = await Category.findOne({ name: new RegExp(category, 'i') });
            if (cat) query.cat_id = cat._id;
        }

        if (cuisineId && cuisineId !== "All" && cuisineId !== "None") {
            query.cuisineId = cuisineId;
        }

        if (area && area !== "All" && area !== "None") {
            // If they specifically selected area from dropdown, we intersect or overwrite
            query.area = { $in: [new RegExp(area, "i")] };
        }

        const dishes = await Dish.find(query)
            .populate('cat_id', 'name')
            .populate('cuisineId', 'name')
            .populate('chef', 'full_name');

        res.status(200).json({
            success: true,
            msg: "Dishes searched successfully",
            data: dishes
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getDishById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Dish ID format");
        }

        const dish = await Dish.findById(id)
            .populate('cat_id', 'name')
            .populate('cuisineId', 'name')
            .populate('chef', 'full_name');

        if (!dish) return ThrowError(res, 404, "Dish not found");

        res.status(200).json({ success: true, msg: "Dish fetched successfully", data: dish });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getDishesByArea = async (req, res) => {
    try {
        const { area } = req.query; // Postman માંથી ?area=Cafe એવી રીતે આવશે

        let query = {};

        // જો યુઝર એરિયા મોકલે, તો ફિલ્ટર લગાવો
        if (area) {
            // area એ એરે છે, એટલે આપણે $in વાપરીશું જેથી તે એરિયા લિસ્ટમાં ચેક કરે
            query.area = { $in: [new RegExp(area, "i")] };
        }

        const dishes = await Dish.find(query)
            .populate('cat_id', 'name')
            .populate('cuisineId', 'name')
            .populate('chef', 'full_name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: dishes.length,
            msg: area ? `${area} dishes fetched successfully` : "All dishes fetched successfully",
            data: dishes
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const updateDish = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Dish ID format");
        }

        const dish = await Dish.findById(id);
        if (!dish) return ThrowError(res, 404, "Dish not found");

        if (req.body.cat_id) {
            if (!mongoose.Types.ObjectId.isValid(req.body.cat_id)) {
                return sendBadRequestResponse(res, "Invalid Category ID format");
            }
            const catExists = await Category.findById(req.body.cat_id);
            if (!catExists) return ThrowError(res, 404, "Category not found");
            dish.cat_id = req.body.cat_id;
        }

        if (req.file) {
            if (dish.img) await deleteFileFromS3(dish.img);
            const uploadResult = await uploadFile(req.file);
            dish.img = uploadResult.url;
        }

        if (req.body.chef) {
            let chefIds = [];

            if (typeof req.body.chef === "string") {
                try {
                    const parsed = JSON.parse(req.body.chef);
                    chefIds = Array.isArray(parsed) ? parsed : [parsed];
                } catch {
                    chefIds = req.body.chef.split(",").map(id => id.trim());
                }
            } else if (Array.isArray(req.body.chef)) {
                chefIds = req.body.chef;
            }

            const validChefs = [];

            for (let id of chefIds) {
                if (!mongoose.Types.ObjectId.isValid(id)) continue;

                const user = await UserModel.findById(id).catch(() => null);

                if (user && user.role === "Chef") {
                    validChefs.push(user._id);
                }
            }

            if (!validChefs.length) {
                return sendBadRequestResponse(res, "Valid chefs not found");
            }

            dish.chef = validChefs;
        }

        if (req.body.area) {
            let parsedArea = [];
            if (typeof req.body.area === "string") {
                try {
                    const jsonParsed = JSON.parse(req.body.area);
                    if (Array.isArray(jsonParsed)) {
                        parsedArea = jsonParsed.map(a => {
                            const val = a.trim().toLowerCase();
                            if (val === "restaurant") return "Restaurant";
                            if (val === "cafe") return "Cafe";
                            if (val === "bar") return "Bar";
                            return "";
                        }).filter(Boolean);
                    }
                } catch {
                    parsedArea = req.body.area.split(",").map(a => {
                        const val = a.trim().toLowerCase();
                        if (val === "restaurant") return "Restaurant";
                        if (val === "cafe") return "Cafe";
                        if (val === "bar") return "Bar";
                        return "";
                    }).filter(Boolean);
                }
            } else {
                parsedArea = Array.isArray(req.body.area) ? req.body.area : [req.body.area];
            }

            if (!parsedArea.length) return sendBadRequestResponse(res, "Invalid area values");
            dish.area = parsedArea;
        }

        if (req.body.ingredients) {
            let cleanIng = String(req.body.ingredients).replace(/[\[\]"]/g, "");
            dish.ingredients = cleanIng.split(",").map(i => i.trim()).filter(Boolean);
        }

        if (req.body.cuisineId) {
            if (!mongoose.Types.ObjectId.isValid(req.body.cuisineId)) {
                return sendBadRequestResponse(res, "Invalid Cuisine ID format");
            }
            const cuisineExists = await Cuisine.findById(req.body.cuisineId);
            if (!cuisineExists) return ThrowError(res, 404, "Cuisine not found");
            dish.cuisineId = req.body.cuisineId;
        }

        dish.name = req.body.name || dish.name;
        dish.short_des = req.body.short_des || dish.short_des;
        dish.des = req.body.des || dish.des;
        dish.mealType = req.body.mealType || dish.mealType;
        dish.price = req.body.price || dish.price;
        dish.prepTime = req.body.prepTime || dish.prepTime;
        dish.intensity = req.body.intensity || dish.intensity;
        dish.status = req.body.status || dish.status;

        if (req.body.badges) {
            try {
                dish.badges = JSON.parse(req.body.badges);
            } catch {
                dish.badges = [req.body.badges];
            }
        }

        const updatedDish = await dish.save();
        return res.status(200).json({ success: true, msg: "Dish updated successfully", data: updatedDish });

    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const deleteDish = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Dish ID format");
        }

        const dish = await Dish.findById(id);
        if (!dish) return ThrowError(res, 404, "Dish not found");

        if (dish.img) await deleteFileFromS3(dish.img);

        await dish.deleteOne();
        res.status(200).json({ success: true, msg: "Dish deleted successfully", data: dish });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getCategoriesByArea = async (req, res) => {
    try {
        const { area } = req.query;

        let query = {};

        if (area) {
            query.area = { $in: [new RegExp(area, "i")] };
        }

        const categories = await Category.find(query).sort({ createdAt: -1 });

        if (categories.length === 0) {
            return res.status(200).json({
                success: true,
                msg: area ? `No categories found for ${area}` : "No categories found",
                data: []
            });
        }

        res.status(200).json({
            success: true,
            count: categories.length,
            msg: area ? `${area} categories fetched successfully` : "All categories fetched successfully",
            data: categories
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};