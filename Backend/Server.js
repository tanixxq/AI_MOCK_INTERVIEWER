import express from 'express';
import { connectDB } from "./Config/db.js";
import mongoose from 'mongoose';
import dotenv from "dotenv";
import {register} from "./Controllers/authControllers.js";
import AuthRoutes from "./Routes/AuthRoutes.js";
import UserRoutes from "./Routes/UserRoutes.js";


dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use("/api/auth", AuthRoutes);
app.use("/api/user", UserRoutes);

app.listen(3000,()=>{
    console.log("Servers started on port 3000");
})

export default app;