import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";

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

    // 1) Build your prompt to pass to the model
    const prompt = `
Topic: ${topic}
Description: ${description}
Difficulty: ${difficulty}
Generate ${numQuestions} multiple-choice questions with 4 options for the topic described above. 
Make sure each question has:
- 4 distinct choices: A, B, C, D.
- One correct answer (randomly between 1 and 4).
- Each question must be clearly understandable for undergraduate engineering students.
`.trim();

    try {
        // 2) Use Hugging Face's question generation model (distilbert)
        const hfRes = await axios.post(
            "https://api-inference.huggingface.co/models/distilbert-base-uncased-distilled-squad",
            { inputs: prompt },
            { headers: { Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}` } }
        );

        // 3) Process the result into a usable format
        const genText = hfRes.data[0].generated_text;

        // Split the result into questions and options
        const questions = genText.split("\n\n").slice(0, numQuestions).map((block) => {
            const lines = block.split("\n");
            const question = lines[0].replace("Question:", "").trim();
            const options = lines.slice(1, 5).map((line) => line.split(":")[1].trim());
            const answerLine = lines[5].replace("Answer:", "").trim();
            const answer = ["A", "B", "C", "D"].indexOf(answerLine) + 1;

            return { question, options, answer };
        });

        return res.json({ questions });
    } catch (err) {
        console.error(err.response?.data || err.message);
        const status = err.response?.status === 503 ? 503 : 500;
        return res.status(status).json({
            error:
                status === 503
                    ? "Hugging Face is temporarily unavailable. Try again later."
                    : "Failed to generate questions",
            details: err.response?.data ?? err.message,
        });
    }
};




// export const questionLogic = async (req, res) => {
//   const { topic, description, difficulty, numQuestions } = req.body;

//   const prompt = `Generate ${numQuestions} multiple-choice questions (with 4 options and 1 correct answer) at a ${difficulty} level for the following topic. Each question should have clear and distinct options.

// Topic: "${topic}"
// Description: ${description}

// Please make sure the questions are clear and appropriate for undergraduate engineering students.`;

//   try {
//       const response = await axios.post(
//           'https://api-inference.huggingface.co/models/distilbert-base-uncased-distilled-squad',  // Alternative model endpoint
//           { inputs: prompt },
//           {
//               headers: {
//                   Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
//               },
//           }
//       );


//     const generated = response.data;

//     // Hugging Face might return a string or array depending on the model
//     const questions = Array.isArray(generated)
//       ? generated.slice(0, numQuestions)
//       : [generated].slice(0, numQuestions);

//     res.json({ questions });
//   } catch (err) {
//     console.error(err.response?.data || err.message);
//     res.status(500).json({ error: "Failed to generate questions" });
//   }
// };
