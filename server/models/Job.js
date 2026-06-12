import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  companyName: { type: String, required: true }, // Required field
  dateApplied: {
  type: String, 
  required: true,
},
  jobTitle: { type: String, required: true }, // Required field
  // pay: { type: String}, // Required field
  status: {
    type: String,
    enum: ["applied", "rejected", "no response", "ghosted", "interview going on", "Job"],
    default: "applied",
  },
  source:{type:String, required:true},
  referralName: { type: String, default: "" },
  url: { type: String }, // Required field
  sponsorship: { type: String, enum: ["yes", "no"], default: "yes" }
});

// Every job query is scoped to a user and sorted by date, so this compound
// index lets Mongo serve the list (and its sort) without a collection scan.
JobSchema.index({ userId: 1, dateApplied: -1 });

export default mongoose.model("Job", JobSchema);
