import express from "express";
import {register,login,getCurrentUser} from "../Controllers/authControllers.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/register",register);
router.post("/login",login);

router.get("/me", authMiddleware, getCurrentUser);


export default router;