import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

// Initialize the Google AI SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

export default genAI;