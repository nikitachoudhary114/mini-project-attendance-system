import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    rollNo: { type: String, required: true, unique: true },
    status: { type: String, enum: ["present", "absent"], default: "absent" },
    date: { type: Date, default: Date.now },
});

export default mongoose.model("Attendance", attendanceSchema);