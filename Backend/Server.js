import "./Config/env.js";

import express from "express";
import { connectDB } from "./Config/db.js";
import AuthRoutes from "./Routes/AuthRoutes.js";
import UserRoutes from "./Routes/UserRoutes.js";
import InterviewRoutes from "./Routes/InterviewRoutes.js";
import cors from "cors";

connectDB();

const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

app.use(express.json());

app.use("/api/auth", AuthRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/interviews", InterviewRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});

export default app;