import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import question from "../model/question.js";
import attendance from "../model/attendance.js";


export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};







export const questionLogic = async (req, res) => {
  const { topic, description, difficulty, numQuestions } = req.body;

  // 1) Build your prompt
  const prompt = `
Generate ${numQuestions} multiple-choice questions for undergraduate engineering students.

Strictly follow this format for EACH question:

Question: <text of the question>
A: <option A>
B: <option B>
C: <option C>
D: <option D>
Answer: <correct option letter (A, B, C, or D)>

Topic: ${topic}
Description: ${description}
Difficulty: ${difficulty}

Only return questions in the above format. Do not add explanations or notes.
`.trim();

  try {
    // 2) Send API request to Together.ai
    const togetherRes = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1", // Or other Together models
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1024,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // 3) Extract generated text
    const genText = togetherRes.data.choices[0].message.content;

    // 4) Process the text into structured questions
    const questionBlocks = genText.split("\n\n").slice(0, numQuestions);

    const questions = questionBlocks.map((block) => {
      const lines = block.trim().split("\n");
      const question = lines[0].replace("Question:", "").trim();
      const options = lines.slice(1, 5).map((line) => line.split(":")[1].trim());
      const answerLine = lines[5].replace("Answer:", "").trim();
      const answer = ["A", "B", "C", "D"].indexOf(answerLine) + 1;

      return { question, options, answer };
    });

    // Save questions to the database
    const savedQuestions = await question.create({
      topic,
      description,
      difficulty,
      date: new Date(),
      questions,
    });

    // savedQuestions.save();

    res.status(200).json({ questions: savedQuestions.questions });
  } catch (err) {
    console.error(err.response?.data || err.message);
    return res.status(500).json({
      error: "Failed to generate questions",
      details: err.response?.data ?? err.message,
    });
  }
};

export const questiondata = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    // Convert the date to a range for filtering
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Find questions for the specified date
    const data = await question.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const randomQuestion = async (req, res) => {
  try {
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of the day
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // End of the day

    // Find all questions for today's date
    const todayQuestions = await question.find({
      date: { $gte: today, $lte: endOfDay },
    });

    if (todayQuestions.length === 0) {
      return res.status(404).json({ message: "No questions found for today." });
    }

    // Flatten all questions into a single array
    const allMCQs = todayQuestions.flatMap((q) => q.questions);

    if (allMCQs.length === 0) {
      return res.status(404).json({ message: "No MCQs found for today." });
    }

    // Pick a random question
    const randomIndex = Math.floor(Math.random() * allMCQs.length);
    const randomQuestion = allMCQs[randomIndex];

    // Send the random question to the frontend
    res.status(200).json({
      id:randomQuestion._id,
      question: randomQuestion.question,
      options: randomQuestion.options,
      answer: randomQuestion.answer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const checkResult = async (req, res) => {
  const { questionId, selectedAnswer, rollNo } = req.body;

  try {
    // Find the question by its ID
    const questionDoc = await question.findOne({ "questions._id": questionId });

    if (!questionDoc) {
      return res.status(404).json({ message: "Question not found." });
    }

    // Find the specific question in the questions array
    const questionData = questionDoc.questions.find((q) => q._id.toString() === questionId);

    if (!questionData) {
      return res.status(404).json({ message: "Question not found in the database." });
    }

    // Check if the selected answer is correct
    const isCorrect = parseInt(selectedAnswer) === parseInt(questionData.answer);

    if (isCorrect) {
      // Save the roll number as present in the attendance database
      const attendanceRecord = await attendance.findOneAndUpdate(
        { rollNo }, // Find the record by roll number
        { $set: { status: "present" } }, // Update the status to "present"
        { upsert: true, new: true } // Create a new record if it doesn't exist
      );

      return res.status(200).json({
        message: "Correct answer! Attendance marked as present.",
        attendance: attendanceRecord,
      });
    } else {
      // Save the roll number as absent in the attendance database
      const attendanceRecord = await attendance.findOneAndUpdate(
        { rollNo }, // Find the record by roll number
        { $set: { status: "absent" } }, // Update the status to "absent"
        { upsert: true, new: true } // Create a new record if it doesn't exist
      );

      return res.status(200).json({
        message: "Incorrect answer. Attendance marked as absent.",
        attendance: attendanceRecord,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getAttendanceByDate = async (req, res) => {
  const { date } = req.query;

  try {
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    // Convert the date to a range for filtering
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch attendance records for the specified date and sort by roll number
    const attendanceData = await attendance
      .find({ date: { $gte: startOfDay, $lte: endOfDay } })
      .sort({ rollNo: 1 }); // Sort by roll number in ascending order

    res.status(200).json({ success: true, data: attendanceData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};