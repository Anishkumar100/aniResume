import ai from "../config/ai.js"
import Resume from "../models/resume.js"

// controller for enhancing a resume's professional Summary
//POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const { userContent } = req.body

        if (!userContent) {
            return res.status(400).json({ message: `Type something to generate the summary` })
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                { role: "system", content: "You Are an expert in resume writing. Your task is to enhance the professional summary of a resume. The Summary should be 3-4 sentences also highlighting the key skills, experience, and career objectives.Make it compelling and ATS-friendly. And only return text no options or anything else." },//this is the place where you tell the ai what to do


                { role: "user", content: userContent }
                // And this serves as the prompt
            ]
        })

        const enhancedContent = response.choices[0].message.content // syntax from gemini docs

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

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                { role: "system", content: "You Are an expert in resume writing. Your task is to enhance the Job Description of a resume. The Job Description should be 2-3 sentences also highlighting the key responsibilites and achievements.Use action verbs and qualifiable results where possible.Make it compelling and ATS-friendly. And only return text no options or anything else." },//this is the place where you tell the ai what to do


                { role: "user", content: userContent }
                // And this serves as the prompt
            ]
        })

        const enhancedContent = response.choices[0].message.content // syntax from gemini docs

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

        const userId = req.userId

        if (!resumeText) {
            return res.status(400).json({ message: `Missing required Fields` })
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                { role: "system", content: "You are an expert AI agent to extract data from resume" },//this is the place where you tell the ai what to do


                {
                    role: "user", content: `extract data from this resume: ${resumeText} 
                Provide data in the following JSON format with no additional text before or after:
    {
    professional_summary:
    {
        type:String,
        default:""
    },
    skills:
    [{
        type:String
    }],
    personal_info:
    {
        image:{
            type:String,
            default:""
        },
        full_name:
        {
            type:String,
            default:""
        },
        profession:
        {
            type:String,
            default:""
        },
        email:
        {
            type:String,
            default:""
        },
        phone:
        {
            type:String,
            default:""
        },
        location:
        {
            type:String,
            default:""
        },
        linkedin:
        {
            type:String,
            default:""
        },
        website:
        {
            type:String,
            default:""
        }
    },
    experience:[
    {
        company:{
            type:String,
        },
        position:
        {
            type:String,
        },
        start_date:
        {
            type:String,
        },
        end_date:
        {
            type:String,
        },
        description:
        {
            type:String,
        },
        is_current:{
            type:Boolean
        },
    }],

    projects:[
        {
            name:{
                type:String,
            },
            type:
            {
                type:String,
            },
            description:
            {
                type:String,
            },
        }
    ],

    education:[
    {
        institution:{
            type:String,
        },
        degree:
        {
            type:String,
        },
        field:
        {
            type:String,
        },
        graduation_date:
        {
            type:String,
        },
        gpa:
        {
            type:String,
        }
    }
    ]
    }`}
                // And this serves as the prompt
            ],
            response_format: { type: 'json_object' }
            //requesting output to be in json format
        })

        const enhancedContent = response.choices[0].message.content // syntax from gemini docs

        //since we are ggetting the result in json format we need to parse it

        const parsedData = JSON.parse(enhancedContent)
        const newResume = await Resume.create({ userId, title, ...parsedData })
        return res.status(200).json({ resumeId: newResume._id, newResume })
    }
    catch (error) {
        return res.status(400).json({ message: `Sorry Couldnt upload resume for now. Please try again later` })
    }
} 