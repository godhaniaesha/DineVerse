import { Blog } from "../models/Blog.js";
import { uploadFile, deleteFileFromS3 } from "../utils/uploadFile.utils.js";
import { sendBadRequestResponse } from "../utils/Response.utils.js";
import { ThrowError } from "../utils/Error.utils.js";
import mongoose from "mongoose";
export const addBlog = async (req, res) => {
    try {
        const { title, short_des, des, area, status } = req.body;

        if (!title) return sendBadRequestResponse(res, "Title is required");

        let coverImg = "";

        if (req.files?.coverImg?.[0]) {
            const uploadResult = await uploadFile(req.files.coverImg[0]);
            coverImg = uploadResult.url;
        }

        const blog = await Blog.create({
            title,
            short_des,
            des,
            coverImg,
            area: area || "Restaurant",
            status: status || "draft",
            likes: [],
            addedBy: req.user._id
        });

        return res.status(201).json({
            success: true,
            msg: "Blog added successfully",
            data: blog
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const getBlogs = async (req, res) => {
    try {
        const { status } = req.query;
        
        // Build query filter
        const query = {};
        if (status && (status === "published" || status === "draft")) {
            query.status = status;
        }

        const blogs = await Blog.find(query)
            .populate("addedBy", "full_name img")
            .populate("likes", "full_name")
            .sort({ createdAt: -1 });

        const formatted = blogs.map(blog => ({
            ...blog._doc,
            likesCount: blog.likes.length
        }));

        return res.status(200).json({
            success: true,
            msg: "Blogs fetched successfully",
            data: formatted
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Blog ID format");
        }

        const blog = await Blog.findById(id)
            .populate("addedBy", "full_name")
            .populate("likes", "full_name");

        if (!blog) return ThrowError(res, 404, "Blog not found");

        return res.status(200).json({
            success: true,
            msg: "Blog fetched successfully",
            data: {
                ...blog._doc,
                likesCount: blog.likes.length
            }
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const toggleLike = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Blog ID format");
        }

        const blog = await Blog.findById(id);
        if (!blog) return ThrowError(res, 404, "Blog not found");

        const alreadyLiked = blog.likes.includes(userId);

        if (alreadyLiked) {
            blog.likes = blog.likes.filter(uid => uid.toString() !== userId.toString());
        } else {
            blog.likes.push(userId);
        }

        await blog.save();

        return res.status(200).json({
            success: true,
            msg: alreadyLiked ? "Like removed" : "Blog liked",
            likesCount: blog.likes.length
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Blog ID format");
        }

        const blog = await Blog.findById(id);
        if (!blog) return ThrowError(res, 404, "Blog not found");

        if (req.files?.coverImg?.[0]) {
            if (blog.coverImg) await deleteFileFromS3(blog.coverImg);
            const uploadResult = await uploadFile(req.files.coverImg[0]);
            blog.coverImg = uploadResult.url;
        }

        blog.title = req.body.title || blog.title;
        blog.short_des = req.body.short_des || blog.short_des;
        blog.des = req.body.des || blog.des;
        blog.area = req.body.area || blog.area;
        blog.status = req.body.status || blog.status;

        const updatedBlog = await blog.save();

        return res.status(200).json({
            success: true,
            msg: "Blog updated successfully",
            data: {
                ...updatedBlog._doc,
                likesCount: updatedBlog.likes.length
            }
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Blog ID format");
        }

        const blog = await Blog.findById(id);
        if (!blog) return ThrowError(res, 404, "Blog not found");

        if (blog.coverImg) await deleteFileFromS3(blog.coverImg);

        await blog.deleteOne();

        return res.status(200).json({
            success: true,
            msg: "Blog deleted successfully",
            data: blog
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};