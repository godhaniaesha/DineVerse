import UserModel from '../models/UserModel.js';
import { ThrowError } from '../utils/Error.utils.js';
import { sendBadRequestResponse } from '../utils/Response.utils.js';
import { uploadFile, deleteFileFromS3 } from '../utils/uploadFile.utils.js';
import mongoose from 'mongoose';

export const addStaff = async (req, res) => {
    const { full_name, email, phone, role, department, cuisineSpecialization, password, area, status } = req.body;

    try {
        if (!full_name || !email || !phone || !role || !password) {
            return sendBadRequestResponse(res, "Full name, email, phone, role, and password are required");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return sendBadRequestResponse(res, "Invalid email format");
        }

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
            res.status(201).json({ success: true, msg: "Staff added successfully", data: user });
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

        res.json({ success: true, msg: "Staff fetched successfully", data: staff });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const updateStaffProfile = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid staff ID format");
        }

        const user = await UserModel.findById(id);
        if (!user) return ThrowError(res, 404, 'User not found');

        if (req.body.email && req.body.email !== user.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(req.body.email)) {
                return sendBadRequestResponse(res, "Invalid email format");
            }

            const emailExists = await UserModel.findOne({ email: req.body.email, _id: { $ne: id } });
            if (emailExists) {
                return sendBadRequestResponse(res, "Email already in use by another user");
            }
        }

        if (req.file) {
            try {
                if (user.img) await deleteFileFromS3(user.img);
                const uploadResult = await uploadFile(req.file);
                user.img = uploadResult.url;
            } catch (uploadErr) {
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

        const updatedUser = await user.save();

        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        res.json({ success: true, msg: "Staff profile updated successfully", data: userResponse });

    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid staff ID format");
        }

        const user = await UserModel.findById(id);
        if (!user) {
            return ThrowError(res, 404, 'User not found');
        }

        if (user.img) {
            await deleteFileFromS3(user.img);
        }

        await user.deleteOne();
        res.json({ success: true, msg: 'Staff removed successfully' });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};