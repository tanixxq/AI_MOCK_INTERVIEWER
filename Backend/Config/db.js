import mongoose from 'mongoose';
export const connectDB= async()=>{
    try{
        console.log("Mongo URI exists:", !!process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to MongoDB");
    }catch (error){
        console.log(error);
}}
