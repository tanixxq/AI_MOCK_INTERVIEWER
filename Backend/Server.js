import "./Config/env.js";
import express from "express";
import {connectDB} from "./Config/db.js";
import AuthRoutes from "./Routes/AuthRoutes.js";
import UserRoutes from "./Routes/UserRoutes.js";
import InterviewRoutes from "./Routes/interviewRoutes.js";
import cors from "cors";

connectDB();

const app=express();

const allowedOrigin=process.env.FRONTEND_URL||"http://localhost:5173";

app.use(cors({
    origin:allowedOrigin,
    credentials:true
}));

app.use(express.json());

app.use("/api/auth",AuthRoutes);
app.use("/api/users",UserRoutes);
app.use("/api/interviews",InterviewRoutes);

const PORT=process.env.PORT||3000;

app.listen(PORT,"0.0.0.0",()=>{
    console.log(`Server started on port ${PORT}`);
});

export default app;