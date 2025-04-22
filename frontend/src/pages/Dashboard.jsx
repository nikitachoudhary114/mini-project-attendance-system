import React, { useState } from "react";


const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    topicName: "",
    description: "",
    difficultyLevel: "",
    numberOfQuestions: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted successfully!");
    setFormData({
      topicName: "",
      description: "",
      difficultyLevel: "",
      numberOfQuestions: "",
    });
  };

  const handleDownloadCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Topic Name,Description,Difficulty Level,Number of Questions\n${formData.topicName},${formData.description},${formData.difficultyLevel},${formData.numberOfQuestions}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendance_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
    
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-transform transform hover:scale-105"
        >
          Create New Attendance Question
        </button>

        <button
          type="button"
          onClick={handleDownloadCSV}
          className="mt-4 ml-6 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-transform transform hover:scale-105"
        >
          Download CSV
        </button>

        {showForm && (
          <div className="mt-6 bg-gray-100 p-6 rounded shadow-md animate-fade-in relative">
            {/* Close Button */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

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
                Submit
              </button>
            </form>
          </div>
        )}
          </div>
       
    </div>
  );
};

export default Dashboard;
