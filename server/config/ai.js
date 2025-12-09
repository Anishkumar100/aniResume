import OpenAI from "openai";

const ai = new OpenAI({
    apiKey: process.env.GEMINI_API,
    baseURL: process.env.BASE_URL
});

export default ai