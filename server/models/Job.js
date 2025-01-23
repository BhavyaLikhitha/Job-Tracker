import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  companyName: String,
  dateApplied: Date,
  jobTitle: String,
  months: Number,
  pay: Number,
  status: { type: String, enum: ["applied", "rejected", "no response", "ghosted", "interview going on", "Job"], default: "applied" },
  url: String, // Job description URL
  resume: String, // Resume file path
});

export default mongoose.model("Job", JobSchema);
