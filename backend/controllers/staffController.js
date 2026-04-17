import UserModel from '../models/UserModel.js';
import { ThrowError } from '../utils/Error.utils.js';
import { sendBadRequestResponse } from '../utils/Response.utils.js';
import { uploadFile, deleteFileFromS3 } from '../utils/uploadFile.utils.js';

export const addStaff = async (req, res) => {
    const { full_name, email, phone, role, department, cuisineSpecialization, password, area, status } = req.body;

    try {
        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            return ThrowError(res, 400, 'User with this email already exists');
        }

        const user = await UserModel.create({
            full_name,
            email,
            phone,
            role,
            department,
            cuisineSpecialization,
            password,
            area,
            status: status || 'Active',
            addedBy: req.user.full_name
        });

        if (user) {
            res.status(201).json({ success: true, data: user });
        } else {
            return ThrowError(res, 400, 'Invalid user data');
        }
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getStaff = async (req, res) => {
    try {
        const staff = await UserModel.find({ role: { $nin: ['User', 'Super Admin'] } }).select('-password');

        if (!staff) {
            return sendBadRequestResponse(res, 404, 'Staff not found');
        }

        res.json({ success: true, data: staff });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const updateStaffProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);

        if (!user) return ThrowError(res, 404, 'User not found');

        if (req.file) {
            try {
                if (user.img) await deleteFileFromS3(user.img);
                const uploadResult = await uploadFile(req.file);
                user.img = uploadResult.url;
                console.log("✅ Image uploaded =>", user.img);
            } catch (uploadErr) {
                console.log("❌ Upload error =>", uploadErr.message);
                console.log("❌ Upload stack =>", uploadErr.stack);
                return ThrowError(res, 500, uploadErr.message);
            }
        }

        user.full_name = req.body.full_name || user.full_name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.role = req.body.role || user.role;
        user.department = req.body.department || user.department;
        user.area = req.body.area || user.area;
        user.status = req.body.status || user.status;

        if (req.body.password) {
            user.password = req.body.password;
        }

        console.log("=== BEFORE SAVE ===");
        const updatedUser = await user.save();
        console.log("=== AFTER SAVE ===");

        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        res.json({ success: true, data: userResponse });

    } catch (error) {
        console.log("❌ CATCH ERROR =>", error.message);
        console.log("❌ CATCH STACK =>", error.stack);
        return ThrowError(res, 500, error.message);
    }
};

export const deleteStaff = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.json({ success: true, message: 'User removed' });
        } else {
            return ThrowError(res, 404, 'User not found');
        }
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};