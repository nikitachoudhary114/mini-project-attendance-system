import React, { useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    topicName: "",
    description: "",
    difficultyLevel: "",
    numberOfQuestions: "",
  });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send data to your backend API
      const response = await axios.post(
        "http://localhost:8080/api/users/generate-questions",
        {
          topic: formData.topicName,
          description: formData.description,
          difficulty: formData.difficultyLevel,
          numQuestions: parseInt(formData.numberOfQuestions),
        }
      );

      if (response.status === 200) {
        setQuestions(response.data.questions);
        alert("Questions generated successfully!");
      } else {
        alert("Error generating questions: " + response.data.error);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred while generating questions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-transform transform hover:scale-105"
      >
        Create New Attendance Question
      </button>

      {showForm && (
        <div className="mt-6 bg-gray-100 p-6 rounded shadow-md animate-fade-in relative">
          <h2 className="text-xl font-bold mb-4">New Attendance Question</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Topic Name
              </label>
              <input
                type="text"
                name="topicName"
                value={formData.topicName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
                placeholder="Enter topic name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
                placeholder="Enter description"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Difficulty Level
              </label>
              <select
                name="difficultyLevel"
                value={formData.difficultyLevel}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
              >
                <option value="">Select difficulty level</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Number of Questions
              </label>
              <input
                type="number"
                name="numberOfQuestions"
                value={formData.numberOfQuestions}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
                placeholder="Enter number of questions"
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-transform transform hover:scale-105"
            >
              {loading ? "Generating..." : "Submit"}
            </button>
          </form>
        </div>
      )}

      {questions.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Generated Questions</h2>
          <div className="space-y-4">
            {questions.map((q, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded shadow-md border border-gray-200"
              >
                <h3 className="font-bold text-lg mb-2">
                  {index + 1}. {q.question}
                </h3>
                <ul className="list-disc pl-6">
                  {q.options.map((option, i) => (
                    <li key={i}>{option}</li>
                  ))}
                </ul>
                <p className="mt-2 text-green-600 font-medium">
                  Correct Answer: {q.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
