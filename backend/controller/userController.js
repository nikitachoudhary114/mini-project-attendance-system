import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import question from "../model/question.js";


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

// export const questionLogic = async (req, res) => {
//   const { topic, description, difficulty, numQuestions } = req.body;

//   const prompt = `
// Generate ${numQuestions} multiple-choice questions for undergraduate engineering students.

// Strictly follow this format for EACH question:

// Question: <text of the question>
// A: <option A>
// B: <option B>
// C: <option C>
// D: <option D>
// Answer: <correct option letter (A, B, C, or D)>

// Topic: ${topic}
// Description: ${description}
// Difficulty: ${difficulty}

// Only return questions in the above format. Do not add explanations or notes.
// `.trim();

//   try {
//     const response = await axios.post(
//       "https://api.openai.com/v1/completions",
//       {
//         model: "text-davinci-003",
//         prompt: prompt,
//         max_tokens: 1500,
//         temperature: 0.7,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const generatedText = response.data.choices[0].text.trim();
//     const questionBlocks = generatedText.split("\n\n").slice(0, numQuestions);

//     const questions = questionBlocks.map((block) => {
//       const lines = block.trim().split("\n");
//       const question = lines[0].replace("Question:", "").trim();
//       const options = lines.slice(1, 5).map((line) => line.split(":")[1].trim());
//       const answer = lines[5].replace("Answer:", "").trim();

//       return { question, options, answer };
//     });

//     // Save questions to the database
//     const savedQuestions = await question.create({
//       topic,
//       description,
//       difficulty,
//       date: new Date(),
//       questions,
//     });

//     res.status(200).json({ questions: savedQuestions.questions });
//   } catch (err) {
//     console.error(err.response?.data || err.message);
//     res.status(500).json({ error: "Failed to generate questions" });
//   }
// };