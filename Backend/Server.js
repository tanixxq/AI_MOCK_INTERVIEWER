import "./Config/env.js";
import express from "express";
import {connectDB} from "./Config/db.js";
import AuthRoutes from "./Routes/AuthRoutes.js";
import UserRoutes from "./Routes/UserRoutes.js";
import InterviewRoutes from "./Routes/interviewRoutes.js";
import cors from "cors";

const app=express();

const allowedOrigins=[
    "http://localhost:5173",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin:allowedOrigins,
    credentials:true
}));

app.use(express.json({limit:"1mb"}));

app.use("/api/auth",AuthRoutes);
app.use("/api/users",UserRoutes);
app.use("/api/interviews",InterviewRoutes);

app.get("/api/health",(req,res)=>{
    res.status(200).json({
        status:"ok",
        message:"AI Mock Interviewer API is running"
    });
});

app.use((req,res)=>{
    res.status(404).json({
        success:false,
        message:"Route not found"
    });
});

app.use((error,req,res,next)=>{
    console.error("Unhandled Server Error:",error.message);

    res.status(error.status||500).json({
        success:false,
        message:error.status
            ?error.message
            :"Internal server error"
    });
});

const PORT=process.env.PORT||3000;

const startServer=async()=>{
    try{
        await connectDB();

        app.listen(PORT,"0.0.0.0",()=>{
            console.log(`Server started on port ${PORT}`);
        });
    }catch(error){
        console.error("Server startup failed:",error.message);
        process.exit(1);
    }
};

startServer();

export default app;