import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "./models/admin.js"; 
import { connectDB } from "./config/db.js"; 

// Load env vars first
dotenv.config();

const seedAdmin = async () => {
    try {
        await connectDB();

        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!email || !password) {
            console.error("❌ Error: ADMIN_EMAIL or ADMIN_PASSWORD missing in .env file");
            process.exit(1);
        }

        // 1. Check if admin exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            console.log("⚠️ Admin already exists");
            process.exit();
        }

        // 2. Hash Password Manually
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create Admin
        const newAdmin = new Admin({
            email,
            password: hashedPassword 
        });

        await newAdmin.save();
        console.log(`✅ Admin (${email}) created successfully!`);
        process.exit();

    } catch (error) {
        console.error("❌ Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();