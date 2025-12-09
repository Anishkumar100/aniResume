import { Router } from "express";
// Ensure you import 'getPublicResumeById'
import { createResume, deleteResume, getResumeById, getPublicResumeById, getUserResumes, updateResume  } from "../controllers/resume.controller.js";
import protect from "../middlewares/userMiddleware.js"
import upload from "../config/multer.js"

const resumeRouter = Router();

//Route for creating the resume
resumeRouter.post('/create',protect,createResume)

//Route for updating the resume
resumeRouter.put('/update',upload.single('image'),protect,updateResume)

//deleting a resume
resumeRouter.delete('/delete/:resumeId',protect,deleteResume)

// ✅ FIX: Use 'getPublicResumeById' here
resumeRouter.get('/public/:resumeId', getPublicResumeById)

//getting a resume which is made public (Private view for editing)
resumeRouter.get('/get/:resumeId',protect,getResumeById)

// Route for getting all user resumes
resumeRouter.get("/user/all", protect,getUserResumes);

export default resumeRouter;