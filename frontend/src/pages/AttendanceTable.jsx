import React, { useState } from "react";
import axios from "axios";

const AttendanceTable = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAttendanceData = async () => {
    if (!selectedDate) {
      alert("Please select a date first.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/users/attendance-by-date?date=${selectedDate}`
      );

      if (response.status === 200) {
        setAttendanceData(response.data.data);
      } else {
        alert("Failed to fetch attendance data.");
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      alert("An error occurred while fetching attendance data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Attendance Data</h1>

      {/* Date Picker */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Select Date:
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-2/3 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Fetch Attendance Button */}
      <button
        onClick={fetchAttendanceData}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Fetch Attendance
      </button>

      {/* Loading Indicator */}
      {loading && (
        <p className="text-blue-500 mt-4">Loading attendance data...</p>
      )}

      {/* Attendance Table */}
      {attendanceData.length > 0 ? (
        <table className="table-auto w-full mt-6 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Roll No</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((record) => (
              <tr key={record._id}>
                <td className="border border-gray-300 px-4 py-2">
                  {record.rollNo}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {record.status}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading &&
        selectedDate && (
          <p className="text-gray-500 mt-4">
            No attendance data found for the selected date.
          </p>
        )
      )}
    </div>
  );
};

export default AttendanceTable;
