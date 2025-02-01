// import Job from "../models/Job.js";

// export const addJob = async (req, res) => {
//   console.log("Request body:", req.body); // Logs job details
//     console.log("Uploaded file:", req.file); // Logs uploaded file details
//     // Check if the uploads directory exists
//     if (!req.file) {
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

// export const getJobs = async (req, res) => {
//   const { userId } = req.user; // Extracted from token
//   console.log("Decoded User ID:", userId); // Debugging

//   if (!userId) {
//     return res.status(400).json({ error: "User ID not found in request" });
//   }

//   try {
//     // Ensure proper creation of ObjectId
//     const objectId = mongoose.Types.ObjectId.createFromHexString(userId);
//     const jobs = await Job.find({ userId: objectId });
//     console.log("Jobs found for user:", jobs); // Debugging
//     res.status(200).json(jobs);
//   } catch (error) {
//     console.error("Error fetching jobs:", error);
//     res.status(500).json({ error: "Error fetching jobs" });
//   }
// };


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


// export const updateJobStatus = async (req, res) => {
//   const { jobId, status } = req.body; // Extract jobId and status from the request body

//   if (!jobId || !status) {
//     return res.status(400).json({ error: "Job ID and status are required" });
//   }

//   try {
//     // Find the job by ID and update its status
//     const updatedJob = await Job.findByIdAndUpdate(
//       jobId,
//       { status },
//       { new: true } // Return the updated document
//     );

//     if (!updatedJob) {
//       return res.status(404).json({ error: "Job not found" });
//     }

//     res.status(200).json({ message: "Job status updated successfully", updatedJob });
//   } catch (error) {
//     console.error("Error updating job status:", error);
//     res.status(500).json({ error: "Error updating job status" });
//   }
// };

import Job from "../models/Job.js";

export const addJob = async (req, res) => {
  console.log("Request body:", req.body); // Logs job details

  const { userId } = req.user;
  const { companyName, dateApplied, jobTitle, months, pay, status, source, url } = req.body;

  // Add validation for required fields
  if (!companyName || !jobTitle || !source ) {
    return res.status(400).json({ error: "All required fields must be provided." });
  }

  try {
    const newJob = new Job({
      userId,
      companyName,
      dateApplied,
      jobTitle,
      months,
      pay,
      status,
      source,
      url,
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    console.error("Error adding new job:", error);
    res.status(500).json({ error: "Error adding job" });
  }
};
import mongoose from "mongoose";

// export const getJobs = async (req, res) => {
//   const { userId } = req.user; // Extracted from token
//   console.log("Decoded User ID:", userId); // Debugging

//   if (!userId) {
//     return res.status(400).json({ error: "User ID not found in request" });
//   }

//   try {
//     // Ensure proper creation of ObjectId
//     const objectId = mongoose.Types.ObjectId.createFromHexString(userId);
//     const jobs = await Job.find({ userId: objectId });
//     console.log("Jobs found for user:", jobs); // Debugging
//     res.status(200).json(jobs);
//   } catch (error) {
//     console.error("Error fetching jobs:", error);
//     res.status(500).json({ error: "Error fetching jobs" });
//   }
// };

export const getJobs = async (req, res) => {
  const { userId } = req.user; // Extracted from token
  console.log("Decoded User ID:", userId); // Debugging

  if (!userId) {
    return res.status(400).json({ error: "User ID not found in request" });
  }

  try {
    // Ensure proper creation of ObjectId
    const objectId = mongoose.Types.ObjectId.createFromHexString(userId);

    // Fetch jobs and sort by dateApplied in descending order
    const jobs = await Job.find({ userId: objectId }).sort({ dateApplied: -1 });

    // console.log("Jobs found for user:", jobs); // Debugging
     // Convert today's date to YYYY-MM-DD format in EST (no UTC shift)
     const today = new Date();

     // Convert UTC time to EST manually
     const estOffset = -5 * 60; // EST is UTC-5 (in minutes)
     const estDate = new Date(today.getTime() + estOffset * 60000);
     estDate.setHours(0, 0, 0, 0); // Reset to midnight in EST
     
     // Format as YYYY-MM-DD without UTC conversion
     const todayString = estDate.toISOString().split("T")[0];
     
     console.log("Today's Date (Forced to EST):", todayString); // Debugging
     

    // Count jobs applied today (adjusted for timezone)
    const jobsAppliedToday = jobs.filter((job) => {
      const jobDate = new Date(job.dateApplied);
      jobDate.setHours(0, 0, 0, 0); // Reset to local midnight
      const jobDateString = jobDate.toLocaleDateString("en-CA"); // ✅ Correct format

      console.log(`Comparing jobDate=${jobDateString} with today=${todayString}`); // Debugging
      return jobDateString === todayString;
    }).length;

    console.log("Jobs Applied Today:", jobsAppliedToday); // Debugging


      res.status(200).json({ jobs, jobsAppliedToday });
    // res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Error fetching jobs" });
  }
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