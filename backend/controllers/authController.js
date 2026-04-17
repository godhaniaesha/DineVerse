import UserModel from '../models/UserModel.js';
import generateToken from '../utils/generateToken.js';
import { ThrowError } from '../utils/Error.utils.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();
export const register = async (req, res) => {
    const { full_name, email, phone, password, role } = req.body;

    try {
        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            return ThrowError(res, 400, "User with this email already exists");
        }

        const user = await UserModel.create({
            full_name,
            email,
            phone,
            password,
            role: role || 'User'
        });

        if (user) {
            const token = generateToken(user._id);
            res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: {
                    _id: user._id,
                    full_name: user.full_name,
                    email: user.email,
                    role: user.role,
                    token: token
                }
            });
        } else {
            return ThrowError(res, 400, "Invalid user data");
        }
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const login = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            if (role && user.role !== role) {
                return ThrowError(res, 401, `Account does not have ${role} privileges`);
            }

            if (user.status === 'Inactive') {
                return ThrowError(res, 403, "Account is inactive");
            }

            const token = generateToken(user._id);
            res.json({
                success: true,
                message: "Logged in successfully",
                data: {
                    _id: user._id,
                    full_name: user.full_name,
                    email: user.email,
                    role: user.role,
                    token: token
                }
            });
        } else {
            return ThrowError(res, 401, "Invalid email or password");
        }
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return ThrowError(res, 400, 'Old password and new password are required');
        }

        const user = await UserModel.findById(req.user._id);
        if (!user) return ThrowError(res, 404, 'User not found');

        const isMatch = await user.matchPassword(oldPassword);
        if (!isMatch) return ThrowError(res, 400, 'Old password is incorrect');
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        user.password = newPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            msg: 'Password changed successfully',
            token,
            data: user
        });

    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'DineVerse - Password Reset OTP',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Password Reset Request</h2>
                <p>Your OTP for password reset is:</p>
                <h1 style="color: #D4A843; letter-spacing: 5px;">${otp}</h1>
                <p>This OTP is valid for <b>10 minutes</b> only.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) return ThrowError(res, 400, 'Email is required');

        const user = await UserModel.findOne({ email });
        if (!user) return ThrowError(res, 404, 'User with this email not found');
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user.resetOTP = otp;
        user.resetOTPExpiry = otpExpiry;
        await user.save();
        await sendOTPEmail(email, otp);

        return res.status(200).json({
            success: true,
            msg: 'OTP sent to your email',
            data: null
        });

    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return ThrowError(res, 400, 'Email and OTP are required');
        }

        const user = await UserModel.findOne({ email });
        if (!user) return ThrowError(res, 404, 'User not found');
        if (user.resetOTP !== otp) {
            return ThrowError(res, 400, 'Invalid OTP');
        }
        if (user.resetOTPExpiry < new Date()) {
            user.resetOTP = null;
            user.resetOTPExpiry = null;
            await user.save();
            return ThrowError(res, 400, 'OTP has expired');
        }
        const resetToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );
        user.resetOTP = null;
        user.resetOTPExpiry = null;
        await user.save();

        return res.status(200).json({
            success: true,
            msg: 'OTP verified successfully',
            resetToken
        });

    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if (!email || !newPassword || !confirmPassword) {
            return ThrowError(res, 400, 'Email, new password and confirm password are required');
        }

        if (newPassword !== confirmPassword) {
            return ThrowError(res, 400, 'Passwords do not match');
        }

        const user = await UserModel.findOne({ email });
        if (!user) return ThrowError(res, 404, 'User not found');

        user.password = newPassword;
        user.resetOTP = null;
        user.resetOTPExpiry = null;
        await user.save();

        return res.status(200).json({
            success: true,
            msg: 'Password reset successfully',
            data: null
        });

    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};