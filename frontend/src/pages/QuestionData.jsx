import React, { useState } from "react";
import axios from "axios";

const QuestionData = () => {
  const [topics, setTopics] = useState([]); // Store topics and their questions
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    if (!selectedDate) {
      alert("Please select a date first.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/users/allQuestions?date=${selectedDate}`
      );
      if (response.status === 200) {
        setTopics(response.data.data); // Store the topics and their questions
      } else {
        alert("Failed to fetch questions for the selected date.");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("An error occurred while fetching questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Question Data</h1>

      {/* Date Picker */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Select Date:
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="w-2/3 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Fetch Questions Button */}
      <button
        onClick={fetchQuestions}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-transform transform hover:scale-105"
      >
        Fetch Questions
      </button>

      {/* Loading Indicator */}
      {loading && <p className="text-blue-500 mt-4">Loading questions...</p>}

      {/* Topics and Questions */}
      {topics.length > 0 ? (
        <div className="space-y-6 mt-6">
          {topics.map((topic, topicIndex) => (
            <div key={topic._id} className="bg-gray-100 p-6 rounded shadow-md">
              <h2 className="text-xl font-bold mb-4">
                {topicIndex + 1}. {topic.topic}
              </h2>
              <p className="text-gray-700 mb-4">{topic.description}</p>
              <p className="text-gray-600 mb-4">
                Difficulty:{" "}
                <span className="font-medium">{topic.difficulty}</span>
              </p>
              <div className="space-y-4">
                {topic.questions.map((q, questionIndex) => (
                  <div
                    key={q._id}
                    className="bg-white p-4 rounded shadow-md border border-gray-200"
                  >
                    <h3 className="font-bold text-lg mb-2">
                      {questionIndex + 1}. {q.question}
                    </h3>
                    <ul className="list-disc pl-6">
                      {q.options.map((option, i) => (
                        <li key={i}>{option}</li>
                      ))}
                    </ul>
                    <p className="mt-2 text-green-600 font-medium">
                      Correct Answer: Option {q.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading &&
        selectedDate && (
          <p className="text-gray-500 mt-4">
            No questions found for the selected date.
          </p>
        )
      )}
    </div>
  );
};

export default QuestionData;
