import express from "express";
import { 
    loginAdmin, 
    getAllUsers, 
    deleteUser, 
    getAllResumes, 
    getUserResumesAdmin, 
    deleteResumeAdmin,
    getResumeForAdmin,
    getUserById
} from "../controllers/admin.controller.js";

// Import your custom middleware
import { protect, isAdmin } from "../middlewares/adminMiddleware.js"; 

const adminRouter = express.Router();

// --- PUBLIC ROUTES ---
adminRouter.post("/login", loginAdmin);

// --- PROTECTED ROUTES (Require Token + Admin Check) ---

// 1. User Management
adminRouter.get("/users", protect, isAdmin, getAllUsers);
adminRouter.get("/users/:userId", protect, isAdmin, getUserById); 
adminRouter.delete("/users/:userId", protect, isAdmin, deleteUser);

// 2. Resume Management (Global)
adminRouter.get("/resumes", protect, isAdmin, getAllResumes);
adminRouter.delete("/resumes/:resumeId", protect, isAdmin, deleteResumeAdmin);

// 3. Resume Management (Specific to a User)
adminRouter.get("/users/:userId/resumes", protect, isAdmin, getUserResumesAdmin);

adminRouter.get("/resumes/:resumeId", protect, isAdmin, getResumeForAdmin);

export default adminRouter;