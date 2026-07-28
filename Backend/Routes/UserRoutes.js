import express from "express";
import { getCurrentUser } from "../Controllers/authControllers.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getCurrentUser);

export default router;