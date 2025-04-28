import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    topic: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, required: true },
    date: { type: Date, default: Date.now },
    questions: [
        {
            question: { type: String, required: true },
            options: [{ type: String, required: true }],
            answer: { type: String, required: true },
        },
    ],
});

export default mongoose.model("Question", questionSchema);