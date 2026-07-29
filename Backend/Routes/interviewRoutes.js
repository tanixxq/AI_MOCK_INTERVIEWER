import express from "express";
import { createInterview, getInterviewById, SubmitAnswer } from "../Controllers/Interviewcontroller.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";

const router = express.Router();


router.post("/",authMiddleware,createInterview);
router.get("/:id", authMiddleware, getInterviewById);
router.post("/:id/answer", authMiddleware, SubmitAnswer);


export default router;