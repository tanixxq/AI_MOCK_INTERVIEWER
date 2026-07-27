import express from 'express';
import { connectDB } from "./Config/db.js";
import mongoose from 'mongoose';
import dotenv from "dotenv";


dotenv.config();
connectDB();

const app = express();

app.listen(3000,()=>{
    console.log("Servers started on port 3000");
})

export default app;