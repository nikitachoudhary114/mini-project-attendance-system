import express from "express";
import { registerUser, loginUser, questionLogic } from "../controller/userController.js"; // Update the file extension

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/generate-questions", questionLogic)

export default router;