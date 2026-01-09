import Job from "../models/Job.js";
import mongoose from "mongoose";
export const addJob = async (req, res) => {
  const { userId } = req.user;
  const { companyName, dateApplied, jobTitle, pay, status, source, url } = req.body;

  if (!companyName || !jobTitle || !source) {
    return res.status(400).json({ error: "All required fields must be provided." });
  }

  try {
    const formattedDate = dateApplied;

    const newJob = new Job({
      userId,
      companyName,
      dateApplied: formattedDate,
      jobTitle,
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

export const getJobs = async (req, res) => {
  const { userId } = req.user;

  if (!userId) {
    return res.status(400).json({ error: "User ID not found in request" });
  }

  try {
    const objectId = mongoose.Types.ObjectId.createFromHexString(userId);

    const jobs = await Job.find({ userId: objectId }).sort({ dateApplied: -1 });

    const todayString = new Date()
  .toLocaleDateString("en-CA", { timeZone: "America/New_York" });
      console.log("Today's Date (EST):", todayString); // Debugging
const jobsAppliedToday = jobs.filter(
  (job) => job.dateApplied === todayString
).length;

  console.log("Jobs Applied Today:", jobsAppliedToday); // Debugging
    res.status(200).json({
      jobs: jobs,
      jobsAppliedToday,
    });
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

export const searchJobs = async (req, res) => {
   console.log("Search endpoint hit:", req.query);
  const { userId } = req.user;
  const { query } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "User ID not found" });
  }

  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const objectId = mongoose.Types.ObjectId.createFromHexString(userId);

    const jobs = await Job.find({
      userId: objectId,
      companyName: {
        // $regex: query.trim(),
        $regex: `^${query.trim()}`, 
        $options: "i", // ✅ case-insensitive
      },
    }).sort({ dateApplied: -1 });
    // console.log("Search results:", jobs);
    res.status(200).json({ jobs });
  } catch (error) {
    console.error("Error searching jobs:", error);
    res.status(500).json({ error: "Error searching jobs" });
  }
};
