import express from "express";
import { createInterview, getInterviewById } from "../Controllers/Interviewcontroller.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";

const router = express.Router();


router.post("/",authMiddleware,createInterview);
router.get("/:id", authMiddleware, getInterviewById);


export default router;