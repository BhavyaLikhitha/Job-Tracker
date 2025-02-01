// // import mongoose from "mongoose";

// // const JobSchema = new mongoose.Schema({
// //   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// //   companyName: String,
// //   dateApplied: Date,
// //   jobTitle: String,
// //   months: Number,
// //   pay: Number,
// //   status: { type: String, enum: ["applied", "rejected", "no response", "ghosted", "interview going on", "Job"], default: "applied" },
// //   url: String, // Job description URL
// //   resume: String, // Resume file path
// // });

// // export default mongoose.model("Job", JobSchema);
// import mongoose from "mongoose";

// const JobSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   companyName: String,
//   dateApplied: {
//     type: Date,
//     set: (value) => {
//       console.log("Raw value for dateApplied:", value); 
//       if (!value) return null; // Handle null or undefined
//       const date = new Date(value);
//       if (isNaN(date)) {
//         throw new Error("Invalid date format"); // Handle invalid dates
//       }
//       return new Date(date.toISOString().split("T")[0]); // Ensure only the date part
//     },
//   },
//   jobTitle: String,
//   months: Number,
//   pay: Number,
//   status: {
//     type: String,
//     enum: ["applied", "rejected", "no response", "ghosted", "interview going on", "Job"],
//     default: "applied",
//   },
//   url: String, // Job description URL
//   resume: String, // Resume file path
// });

// export default mongoose.model("Job", JobSchema);
import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  companyName: { type: String, required: true }, // Required field
  dateApplied: {
    type: Date,
    set: (value) => {
      console.log("Raw value for dateApplied:", value);
      if (!value) return null; // Handle null or undefined
      const date = new Date(value);
      if (isNaN(date)) {
        throw new Error("Invalid date format"); // Handle invalid dates
      }
      return new Date(date.toISOString().split("T")[0]); // Ensure only the date part
    },
  },
  jobTitle: { type: String, required: true }, // Required field
  months: { type: Number }, // Required field
  pay: { type: Number}, // Required field
  status: {
    type: String,
    enum: ["applied", "rejected", "no response", "ghosted", "interview going on", "Job"],
    default: "applied",
  },
  source:{type:String, required:true},
  url: { type: String } // Required field
});

export default mongoose.model("Job", JobSchema);
