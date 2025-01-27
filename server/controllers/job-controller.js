// import Job from "../models/Job.js";
// import Grid from "gridfs-stream";

// // Initialize GridFS
// const conn = mongoose.connection;
// let gfs;

// conn.once("open", () => {
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection("uploads"); // Ensure it matches the bucketName in multer-gridfs-storage
// });

import Job from "../models/Job.js";
import mongoose from "mongoose";
import Grid from "gridfs-stream";

// Initialize GridFS
const conn = mongoose.connection;
let gfs;

conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads"); // Collection name
});

export const addJob = async (req, res) => {
  const { userId } = req.user;
  const { companyName, dateApplied, jobTitle, months, pay, status, url } = req.body;

  console.log("Uploaded file details:", req.file);

  try {
    // Wait for the file to be fully processed
    const file = await mongoose.connection.db
      .collection('uploads.files')
      .findOne({ filename: req.file.filename });

    if (!file) {
      console.error("File not found in GridFS");
      return res.status(400).json({ error: "Resume file not found" });
    }

    const newJob = new Job({
      userId,
      companyName,
      dateApplied,
      jobTitle,
      months,
      pay,
      status,
      url,
      resume: file._id, // Use the _id from the found file
    });

    const savedJob = await newJob.save();
    console.log("Job saved successfully:", savedJob);
    res.status(201).json(savedJob);
  } catch (error) {
    console.error("Error saving job:", error);
    res.status(500).json({ error: "Failed to add job: " + error.message });
  }
};

// export const addJob = async (req, res) => {
//   console.log("Request body:", req.body); // Logs job details
//   console.log("Uploaded file:", req.file); // Logs uploaded file details

//   // Check if the file was uploaded
//   if (!req.file) {
//     console.error("No file uploaded!");
//     return res.status(400).json({ error: "Resume file is required" });
//   }

//   console.log("File ID stored in GridFS:", req.file.id);

//   const { userId } = req.user;
//   const { companyName, dateApplied, jobTitle, months, pay, status, url } = req.body;

//   try {
//     const newJob = new Job({
//       userId,
//       companyName,
//       dateApplied,
//       jobTitle,
//       months,
//       pay,
//       status,
//       url,
//       resume: req.file.id, // Save GridFS file ID in the database
//     });

//     const savedJob = await newJob.save();

//     console.log("Job added successfully:", savedJob);
//     res.status(201).json(savedJob);
//   } catch (error) {
//     console.error("Error adding new job:", error);
//     res.status(500).json({ error: "An error occurred while adding the job" });
//   }
// };

// export const addJob = async (req, res) => {
//   console.log("Request body:", req.body); // Logs job details
//     console.log("Uploaded file:", req.file); // Logs uploaded file details
//     // Check if the uploads directory exists
//   console.log("Directory exists:", fs.existsSync("../uploads"));
//   console.log("File path being saved to database:", req.file?.filename);
//     if (!req.file) {
//       console.log("File path to save:", `uploads/${req.file.filename}`);
//       return res.status(400).json({ error: "Resume file is required" });
//     }

//   const { userId } = req.user;
//   const { companyName, dateApplied, jobTitle, months, pay, status, url } = req.body;

//   try {
//     const newJob = new Job({
//       userId,
//       companyName,
//       dateApplied,
//       jobTitle,
//       months,
//       pay,
//       status,
//       url,
//       resume: req.file ? req.file.filename : null,
//       // resume: req.file.filename
//     });
//     // new line added
//     if (!req.file) {
//       console.warn("No file uploaded!");
//     }
//     const savedJob = await newJob.save();
//     // await newJob.save();
//     res.status(201).json(savedJob);
//     // res.status(201).json(newJob);
//   } catch (error) {
//     console.log("error adding new job:",error)
//     // res.status(500).json({ error: "Error adding job" });
//     res.status(500).json({ error: "Error adding job" });
//   }
// };

// import mongoose from "mongoose";

export const getJobs = async (req, res) => {
  const { userId } = req.user; // Extracted from token
  console.log("Decoded User ID:", userId); // Debugging

  if (!userId) {
    return res.status(400).json({ error: "User ID not found in request" });
  }

  try {
    // Ensure proper creation of ObjectId
    const objectId = mongoose.Types.ObjectId.createFromHexString(userId);
    const jobs = await Job.find({ userId: objectId });
    console.log("Jobs found for user:", jobs); // Debugging
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Error fetching jobs" });
  }
};


// export const downloadResume = (req, res) => {
//   const { fileName } = req.params;
//   const filePath = `uploads/${fileName}`;
//   res.download(filePath, (err) => {
//     if (err) {
//         console.log(err)
//       res.status(500).json({ error: "Error downloading file" });
//     }
//   });
// };



export const downloadResume = (req, res) => {
  const { id } = req.params; // Expecting file ID as a parameter

  // Find the file in GridFS by ID
  gfs.files.findOne({ _id: mongoose.Types.ObjectId.createFromHexString(id)  }, (err, file) => {
    if (err) {
      console.error("Error finding file:", err);
      return res.status(500).json({ error: "Error finding file" });
    }

    if (!file) {
      console.error("File not found");
      return res.status(404).json({ error: "File not found" });
    }

    // Check if the file type is supported (e.g., application/pdf)
    if (file.contentType !== "application/pdf") {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    // Stream the file to the response
    const readStream = gfs.createReadStream({ _id: file._id });
    res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);
    readStream.pipe(res);

    // Handle streaming errors
    readStream.on("error", (streamErr) => {
      console.error("Error streaming file:", streamErr);
      res.status(500).json({ error: "Error streaming file" });
    });
  });
};


export const updateJobStatus = async (req, res) => {
  const { jobId, status } = req.body; // Extract jobId and status from the request body

  if (!jobId || !status) {
    return res.status(400).json({ error: "Job ID and status are required" });
  }

  try {
    // Find the job by ID and update its status
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedJob) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.status(200).json({ message: "Job status updated successfully", updatedJob });
  } catch (error) {
    console.error("Error updating job status:", error);
    res.status(500).json({ error: "Error updating job status" });
  }
};