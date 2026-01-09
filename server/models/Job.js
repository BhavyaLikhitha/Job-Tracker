import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  companyName: { type: String, required: true }, // Required field
  dateApplied: {
  type: String, 
  required: true,
},
  jobTitle: { type: String, required: true }, // Required field
  pay: { type: String}, // Required field
  status: {
    type: String,
    enum: ["applied", "rejected", "no response", "ghosted", "interview going on", "Job"],
    default: "applied",
  },
  source:{type:String, required:true},
  url: { type: String } // Required field
});

export default mongoose.model("Job", JobSchema);
