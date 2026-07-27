import mongoose from 'mongoose';
import express from 'express';
export const connectDB= async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to MongoDB");
    }catch (error){
        console.log(error);
}}
