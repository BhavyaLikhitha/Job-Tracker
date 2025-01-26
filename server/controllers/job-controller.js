import Job from "../models/Job.js";

export const addJob = async (req, res) => {
  console.log("Request body:", req.body); // Logs job details
    console.log("Uploaded file:", req.file); // Logs uploaded file details
    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required" });
    }

  const { userId } = req.user;
  const { companyName, dateApplied, jobTitle, months, pay, status, url } = req.body;

  try {
    const newJob = new Job({
      userId,
      companyName,
      dateApplied,
      jobTitle,
      months,
      pay,
      status,
      url,
      resume: req.file ? req.file.filename : null,
      // resume: req.file.filename
    });
    // new line added
    if (!req.file) {
      console.warn("No file uploaded!");
    }
    const savedJob = await newJob.save();
    // await newJob.save();
    res.status(201).json(savedJob);
    // res.status(201).json(newJob);
  } catch (error) {
    console.log("error adding new job:",error)
    // res.status(500).json({ error: "Error adding job" });
    res.status(500).json({ error: "Error adding job" });
  }
};

import mongoose from "mongoose";

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


export const downloadResume = (req, res) => {
  const { fileName } = req.params;
  const filePath = `uploads/${fileName}`;
  res.download(filePath, (err) => {
    if (err) {
        console.log(err)
      res.status(500).json({ error: "Error downloading file" });
    }
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