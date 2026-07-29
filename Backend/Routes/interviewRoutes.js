import express from "express";
import { createInterview, getInterviewById, finishInterview } from "../Controllers/Interviewcontroller.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";

const router = express.Router();


router.post("/",authMiddleware,createInterview);
router.get("/:id", authMiddleware, getInterviewById);
router.post("/:id/finish", authMiddleware, finishInterview);


export default router;