import User from "../models/user.js";
import Resume from "../models/resume.js";
import Admin from "../models/admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// --- AUTHENTICATION ---

// POST: /api/admin/login
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        // Compare plain text password with hashed DB password
        if (admin && (await bcrypt.compare(password, admin.password))) {
            // Sign token with a specific Admin role or separate secret if desired
            const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET);

            return res.json({
                success: true,
                token,
                email: admin.email
            });
        } else {
            return res.status(401).json({ message: "Invalid Admin Credentials" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// --- USER MANAGEMENT ---

// 1. Get All Users
// GET: /api/admin/users
export const getAllUsers = async (req, res) => {
    try {
        // Fetch all users, excluding passwords for security
        // Sort by creation date (newest first)
        const users = await User.find({}).select("-password").sort({ createdAt: -1 });

        return res.status(200).json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: "Failed to fetch users" });
    }
};

// 2. Delete User (and their resumes)
// DELETE: /api/admin/users/:userId
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // 1. Delete all resumes belonging to this user first (cleanup to avoid orphan data)
        await Resume.deleteMany({ userId: userId });

        // 2. Delete the user
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User and their resumes deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ message: "Failed to delete user" });
    }
};


// --- RESUME MANAGEMENT ---

// 3. Get All Resumes (Global)
// GET: /api/admin/resumes
export const getAllResumes = async (req, res) => {
    try {
        // Populate user info (name & email) so admin knows who owns the resume
        const resumes = await Resume.find({})
            .populate("userId", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({ resumes });
    } catch (error) {
        console.error("Error fetching all resumes:", error);
        return res.status(500).json({ message: "Failed to fetch resumes" });
    }
};

// 4. Get All Resumes of a Specific User
// GET: /api/admin/users/:userId/resumes
export const getUserResumesAdmin = async (req, res) => {
    try {
        const { userId } = req.params;

        const resumes = await Resume.find({ userId: userId }).sort({ updatedAt: -1 });

        return res.status(200).json({ resumes });
    } catch (error) {
        console.error("Error fetching user resumes:", error);
        return res.status(500).json({ message: "Failed to fetch user resumes" });
    }
};

// 5. Delete Resume (Admin Override)
// DELETE: /api/admin/resumes/:resumeId
export const deleteResumeAdmin = async (req, res) => {
    try {
        const { resumeId } = req.params;

        const deletedResume = await Resume.findByIdAndDelete(resumeId);

        if (!deletedResume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        return res.status(200).json({ message: "Resume deleted successfully by Admin" });
    } catch (error) {
        console.error("Error deleting resume:", error);
        return res.status(500).json({ message: "Failed to delete resume" });
    }
};



// getting all types of resumes for preview purpose by admin
//6. GET: /api/admin/resumes/:resumeId
export const getResumeForAdmin = async (req, res) => {
    try {
        const { resumeId } = req.params;

        // Admin can find ANY resume by ID, regardless of public/private status
        const resume = await Resume.findById(resumeId).populate("userId", "name email");

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        return res.status(200).json({ resume });
    } catch (error) {
        console.error("Admin Resume Fetch Error:", error);
        return res.status(500).json({ message: error.message });
    }
};



//7. Get indivdual User
// GET: /api/admin/users/:userId
export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        // ✅ 1. SAFETY CHECK: Validate ID format before querying
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid User ID format" });
        }
        // Find user, exclude password
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Failed to fetch user" });
    }
};