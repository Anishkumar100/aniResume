import Resume from "../models/resume.js";
import imagekit from "../config/imagekit.js"
import fs from "fs";


// controller for creating a resume
//POST: /api/resumes/create
export const createResume = async (req, res) => {
    try 
    {
        const userId = req.userId; // from userMiddleware
        const { title } = req.body;

        //create new resume
        const newResume =  await Resume.create({userId,title})
        //rest of the key value pairs will take default values from model

        return res.status(201).json({message: "Resume created successfully", resume: newResume});

    }
    catch(error)
    {
        console.error("Error creating resume:", error);
        return res.status(500).json({message: "Internal Server Error"});
    }

}


//controller for deleting a resume
// DELETE: /api/resumes/delete/:resumeId
export const deleteResume = async (req, res) => {
    try
    {
        const userId = req.userId; // from userMiddleware
        const { resumeId } = req.params;

        await Resume.findOneAndDelete({ _id: resumeId, userId: userId });

        return res.status(200).json({ message: "Resume deleted successfully" });
    }
    catch(error)
    {
        console.error("Error deleting resume:", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}


//get user resume by id (doesnt care about public or private)
// GET: /api/resumes/get/:resumeId
export const getResumeById = async (req, res) => {
    try
    {
        const userId = req.userId; // from userMiddleware
        const {resumeId} = req.params;

        const resume = await Resume.findOne({_id: resumeId, userId: userId});

        if(!resume)
        {
            return res.status(404).json({message: "Resume not found"});
        }
        else
        {
            //making some default values undefined to avoid sending unnecessary data
            resume.__v = undefined;
            resume.createdAt = undefined;
            resume.updatedAt = undefined;
            return res.status(200).json({resume: resume});//sending resume data
        }
    }
    catch(error)
    {
        console.error("Error fetching resume by ID:", error);
        return res.status(500).json({message: error.message});
    }
};


//controller for getting resume which is in public by id
// GET: /api/resumes/public/:resumeId
export const getPublicResumeById = async (req, res) => {
    try
    {
        const {resumeId} = req.params;  
        const resume = await Resume.findOne({_id: resumeId, public: true});
        if(!resume)
        {
            return res.status(404).json({message: "Public resume not found"});
        }
        else
        {
            return res.status(200).json({resume: resume});//sending resume data
        }
    }
    catch(error)
    {
        console.error("Error fetching public resume by ID:", error);
        return res.status(500).json({message: error.message});
    }
};


//controller for updating a resume
// PUT: /api/resumes/update
export const updateResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId, resumeData, removeBackground } = req.body;

        // --- 1. PARSING LOGIC FIX ---
        let resumeDataCopy;

        // Check if resumeData is a string (from FormData) or already an object (from simple JSON request)
        if (typeof resumeData === 'string') {
            try {
                resumeDataCopy = JSON.parse(resumeData);
            } catch (e) {
                // Fallback if parsing fails (e.g., if it was just a plain string title)
                console.error("JSON Parse error:", e);
                return res.status(400).json({ message: "Invalid data format" });
            }
        } else {
            resumeDataCopy = resumeData;
        }

        const image = req.file;

        // --- 2. IMAGE UPLOAD LOGIC ---
        if (image) {
            // Note: Use 'originalname' (lowercase 'n') for multer
            const originalName = req.file.originalname; 
            const imagePath = image.path;

            const response = await imagekit.files.upload({
                file: fs.createReadStream(imagePath),
                fileName: originalName,
                folder: 'user-resumes',
                transformation: {
                    pre: 'w-300,h-300,fo-face,z-0.75' + (removeBackground ? ',e-bgremove' : '')
                }
            });

            // Ensure personal_info object exists before assigning image
            if (!resumeDataCopy.personal_info) {
                resumeDataCopy.personal_info = {};
            }
            resumeDataCopy.personal_info.image = response.url;
            
            // Optional: Delete the temp file after upload to save server space
            // fs.unlinkSync(imagePath); 
        }

        // --- 3. DATABASE UPDATE ---
        const updatedResume = await Resume.findOneAndUpdate(
            { userId, _id: resumeId },
            resumeDataCopy, // Pass the parsed OBJECT, not the string
            { new: true }   // Return the updated document
        );

        if (!updatedResume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        return res.status(200).json({ message: "Changes Saved Successfully", resume: updatedResume });

    } catch (error) {
        console.error("Update Error:", error);
        return res.status(500).json({ message: error.message });
    }
};

// controller for getting all user resumes
// GET: /api/user/resumes

export const getUserResumes = async (req, res) => {
    try 
    {
        const userId= req.userId; // from userMiddleware

        //finding resumes
        const resumes = await Resume.find({userId: userId});

        if(resumes.length === 0)
        {
            return res.status(404).json({message: "Excuse me! You don't have any resumes yet. Create your first and best resume and get placed in your dream job!"});
        }

        return res.status(200).json({resumes: resumes});
    }
    catch(error)
    {
        console.error("Error fetching user resumes:", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
};