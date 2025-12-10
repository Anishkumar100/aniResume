import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import userRouter from './routes/user.routes.js';
import resumeRouter from './routes/resume.routes.js';
import aiRouter from "./routes/ai.routes.js"
import adminRouter from './routes/admin.routes.js';
// database connection
connectDB()

// creating instance of express
const app = express();
const PORT = process.env.PORT || 3000;

// inbuilt middlewares
app.use(cors());
app.use(express.json());

// simplest default route
app.get("/",(req,res)=>
{
    res.send("AI Resume Builder Backend is running...");
})

//created Routes
app.use("/api/users", userRouter);
app.use("/api/resumes",resumeRouter)
app.use("/api/ai",aiRouter)
app.use("/api/admin", adminRouter);

// starting the server
app.listen(PORT,()=>
{
    console.log(`Server is running on PORT: ${PORT}`);
}) 


export default app;