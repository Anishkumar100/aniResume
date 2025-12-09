import mongoose from "mongoose";

export const connectDB = async () => {
 try 
 {
    mongoose.connection.on("connected", () => {
        console.log("MongoDB connected successfully");
    });

    let mongoDBUrl = process.env.MONGODB_URL;
    const projectName= "airesumeSaas";

    if (!mongoDBUrl) {
        throw new Error("MONGODB_URL is not defined in environment variables");
    }

    if (mongoDBUrl.endsWith("/")) {
        mongoDBUrl = mongoDBUrl.slice(0,-1)   
    }

    await mongoose.connect(`${mongoDBUrl}/${projectName}`);

 } 
 catch (error) 
 {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with failure
 }
};


// dont be overwhelmed with the code above, its just a function to connect to mongodb database using mongoose package