import express from "express";
import { createInterview } from "../Controllers/Interviewcontroller.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";

const router = express.Router();


router.post(
    "/",
    authMiddleware,
    createInterview
);


export default router;