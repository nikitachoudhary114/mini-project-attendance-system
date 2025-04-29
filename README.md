# 📌 Smart Attendance System (IoT + RAG Model via Together.ai)

An intelligent attendance system that integrates **ESP32-based IoT hardware**, a **MERN web dashboard**, and a **RAG model via Together.ai** to automate and verify attendance using quiz-based validation. The system ensures attendance is only marked if students correctly answer a dynamically generated MCQ displayed on an LCD screen — making proxy attendance nearly impossible.

---

## 🛠️ Tech Stack

### Hardware
- ESP32-WROOM-32
- 3x4 Keypad
- LED
- LCD Display

### Backend
- Node.js + Express.js
- MongoDB
- Together.ai (RAG model API)
- JWT (authentication)

### Frontend
- React.js (Faculty dashboard)

---

## 💡 Key Features

- 🔐 **JWT-secured login system** for faculty
- ✍️ Faculty can input lecture details (topic, date, subject) from the MERN dashboard
- ❓ Automatically generates MCQs using **Together.ai** from lecture descriptions
- 🧠 When a student enters their **roll number**, a question appears on the **LCD screen**
- ✅ Attendance is marked **only if the answer is correct**
- 📅 View attendance and questions for any specific date
- 📊 MongoDB for storing students, attendance records, and lecture data

---

## ⚙️ System Architecture

```plaintext
[Student Keypad Input + LCD + ESP32]
        |
        v
[ESP32 HTTP Request to MERN Backend]
        |
        +--> [Lecture Info & Questions in MongoDB]
        |
        +--> [Together.ai - RAG Model API]
                 |
                 v
[MCQ Returned and Shown on LCD]
        |
        v
[Student Selects Answer → Verified]
        |
     [If Correct]
        |
        v
[Attendance Marked in MongoDB]
```
## 🔁 Flow Overview
Faculty Workflow:
Logs in via MERN web dashboard (JWT protected)
Inputs lecture topic, subject, and date
System generates MCQs using the Together.ai RAG API
Question and correct option are stored in MongoDB

## Student Workflow:
Student enters roll number on keypad connected to ESP32
Question fetched from MongoDB for the current session
MCQ displayed on LCD screen
Student answers via keypad
If the answer is correct, attendance is marked in the database

## 🧠 RAG Model Usage (via Together.ai)
RAG = Retrieval-Augmented Generation
Input: Lecture topic description difficulty and number of questions
Output: 1 MCQ with 4 options and the correct answer
Powered by Together.ai API for scalable AI inference
Stored in MongoDB for reuse per session/date

## 🖥️ Faculty Dashboard Features
🔐 Login (JWT authentication)
➕ Add lecture details (topic, date, subject)
🧠 Trigger MCQ generation from the lecture topic
🔎 View:
Attendance by date
Generated MCQs by date
Student attendance history

## 🚀 Future Improvements
🤳 Face recognition for attendance verification
📡 Offline caching for poor network zones

## 👩‍💻 Made By
Nikita Choudhary
Electronics and Telecommunication Engineering
Smart Project using MERN + IoT + AI
With ❤️ and RAG.
