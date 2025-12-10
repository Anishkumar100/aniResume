// OLD: import ai from "../config/ai.js"
import genAI from "../config/ai.js"
import Resume from "../models/resume.js"

// controller for enhancing a resume's professional Summary
//POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const { userContent } = req.body

        if (!userContent) {
            return res.status(400).json({ message: `Type something to generate the summary` })
        }

        // OLD: const response = await ai.chat.completions.create({ ... })
        // NEW:
        const model = genAI.getGenerativeModel({ model: process.env.OPENAI_MODEL });

        const prompt = `You Are an expert in resume writing. Your task is to enhance the professional summary of a resume. The Summary should be 3-4 sentences also highlighting the key skills, experience, and career objectives.Make it compelling and ATS-friendly. And only return text no options or anything else."\n\nOriginal: "${userContent}"`;

        const result = await model.generateContent(prompt);
        const enhancedContent = result.response.text();

        // OLD: const enhancedContent = response.choices[0].message.content

        return res.status(200).json({ enhancedContent })
    }
    catch (error) {
        return res.status(400).json({ message: `Sorry Couldn't Use AI for now. Please try again later` })
    }
}



//controller for enhancing the job description
//POST: /api/ai/enhance-job-desc

export const enhanceJobDescription = async (req, res) => {
    try {
        const { userContent } = req.body

        if (!userContent) {
            return res.status(400).json({ message: `Type something to generate the Job Description` })
        }

        const model = genAI.getGenerativeModel({ model: process.env.OPENAI_MODEL });

        const prompt = `You Are an expert in resume writing. Your task is to enhance the Job Description of a resume. The Job Description should be 2-3 sentences also highlighting the key responsibilites and achievements.Use action verbs and qualifiable results where possible.Make it compelling and ATS-friendly. And only return text no options or anything else."\n\nOriginal: "${userContent}"`;

        const result = await model.generateContent(prompt);
        const enhancedContent = result.response.text();

        return res.status(200).json({ enhancedContent })
    }
    catch (error) {
        return res.status(400).json({ message: `Sorry Couldn't Use AI for now. Please try again later` })
    }
}




//controller for uploading a resume to the database
// POST: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
    try {
        const { resumeText, title } = req.body
        // FIX: Standard middleware uses req.user._id
        const userId = req.user?._id || req.userId

        if (!resumeText) return res.status(400).json({ message: `Missing required Fields` })

        // SWITCH TO GOOGLE SDK
        const model = genAI.getGenerativeModel({ model: process.env.OPENAI_MODEL });

        // YOUR EXACT PROMPT logic
        const prompt = `You are an expert AI agent to extract data from resume. extract data from this resume: ${resumeText} 
        Provide data in the following JSON format with no additional text before or after:
        {
            "professional_summary": { "type": "String", "default": "" },
            "skills": [{ "type": "String" }],
            "personal_info": {
                "image": { "type": "String", "default": "" },
                "full_name": { "type": "String", "default": "" },
                "profession": { "type": "String", "default": "" },
                "email": { "type": "String", "default": "" },
                "phone": { "type": "String", "default": "" },
                "location": { "type": "String", "default": "" },
                "linkedin": { "type": "String", "default": "" },
                "website": { "type": "String", "default": "" }
            },
            "experience": [{
                "company": { "type": "String" },
                "position": { "type": "String" },
                "start_date": { "type": "String" },
                "end_date": { "type": "String" },
                "description": { "type": "String" },
                "is_current": { "type": "Boolean" }
            }],
            "projects": [{
                "name": { "type": "String" },
                "type": { "type": "String" },
                "description": { "type": "String" }
            }],
            "education": [{
                "institution": { "type": "String" },
                "degree": { "type": "String" },
                "field": { "type": "String" },
                "graduation_date": { "type": "String" },
                "gpa": { "type": "String" }
            }]
        }`;

        const result = await model.generateContent(prompt);
        let enhancedContent = result.response.text();

        // CLEANUP: Google often adds ```json ... ``` wrapper. We must remove it.
        enhancedContent = enhancedContent.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsedData = JSON.parse(enhancedContent);

        // ERROR FIX: Convert AI's "Skill Objects" to "Strings" to match your DB Schema
        // Your logs showed the AI returning [{name: "C", rating: 5}] which crashed Mongoose.
        if (parsedData.skills && Array.isArray(parsedData.skills)) {
            parsedData.skills = parsedData.skills.map(skill => {
                return typeof skill === 'object' ? skill.name : skill;
            });
        }

        const newResume = await Resume.create({ userId, title, ...parsedData })
        return res.status(200).json({ resumeId: newResume._id, newResume })
    }
    catch (error) {
        console.error("Upload Error:", error); // Log exact error
        return res.status(400).json({ message: `Sorry Couldnt upload resume for now.` })
    }
}