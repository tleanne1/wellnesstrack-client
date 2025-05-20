import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  serviceType: {
    type: String,
    required: true,
    enum: ["consultation", "therapy", "checkup"]
  },
  date: {
    type: Date,
    required: true
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ["Scheduled", "Completed", "Cancelled"],
    default: "Scheduled"
  }
}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);
