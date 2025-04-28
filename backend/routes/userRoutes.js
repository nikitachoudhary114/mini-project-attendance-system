import express from "express";
import { registerUser, loginUser, questionLogic, questiondata, randomQuestion, checkResult, getAttendanceByDate } from "../controller/userController.js"; // Update the file extension

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/generate-questions", questionLogic)
router.get("/allQuestions", questiondata)
router.get("/random-question", randomQuestion)
router.post("/check-result", checkResult);
router.get("/attendance-by-date", getAttendanceByDate);

export default router;