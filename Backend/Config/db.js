import mongoose from "mongoose";

export const connectDB=async()=>{
    try{
        if(!process.env.MONGODB_URI){
            throw new Error("MONGODB_URI is not configured");
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    }catch(error){
        console.error("MongoDB connection error:",error.message);
        process.exit(1);
    }
};