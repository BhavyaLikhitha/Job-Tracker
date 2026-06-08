import Job from "../models/Job.js";
import mongoose from "mongoose";

// Dates manually excluded from the streak (e.g. holidays/breaks). These are
// skipped like weekends: they neither count toward nor break the streak.
const EXCLUDED_DATES = new Set([
  "2026-05-29",
  "2026-05-30",
  "2026-05-31",
  "2026-06-01",
  "2026-06-02",
  "2026-06-03",
]);

// Counts consecutive weekdays (Mon–Fri) with at least one job applied,
// walking back from today. Weekends (Sat/Sun) and excluded dates are skipped
// and never break the streak. Today not having an application yet does not
// break it either.
const calculateStreak = (appliedDates, todayString) => {
  const dates = new Set(
    appliedDates.map((d) => String(d).split("T")[0]).filter(Boolean)
  );

  const [ty, tm, td] = todayString.split("-").map(Number);
  // Anchor at noon UTC so day arithmetic is immune to timezone/DST shifts
  const cursor = new Date(Date.UTC(ty, tm - 1, td, 12));

  let streak = 0;
  for (let i = 0; i < 3650; i++) {
    const day = cursor.getUTCDay(); // 0 = Sun, 6 = Sat
    const cursorStr = cursor.toISOString().split("T")[0];

    if (day === 0 || day === 6) {
      // Weekend: skip without breaking the streak
    } else if (EXCLUDED_DATES.has(cursorStr)) {
      // Manually excluded date: skip without breaking the streak
    } else if (dates.has(cursorStr)) {
      streak += 1;
    } else if (cursorStr === todayString) {
      // No application yet today; the day isn't over, so don't break
    } else {
      break;
    }

    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
};

// Parses ?page & ?limit query params into safe, bounded values.
const getPagination = (req) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  return { page, limit, skip: (page - 1) * limit };
};
export const addJob = async (req, res) => {
  const { userId } = req.user;
  const { companyName, dateApplied, jobTitle, status, source, referralName } = req.body;

  if (!companyName || !jobTitle || !source) {
    return res.status(400).json({ error: "All required fields must be provided." });
  }

  if (source === "referral" && !referralName?.trim()) {
    return res.status(400).json({ error: "Referral name is required for referral applications." });
  }

  try {
    const formattedDate = dateApplied;

    const newJob = new Job({
      userId,
      companyName,
      dateApplied: formattedDate,
      jobTitle,
      // pay,
      status,
      source,
      referralName: source === "referral" ? referralName.trim() : "",
      // url, 
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
    const { page, limit, skip } = getPagination(req);
    const filter = { userId: objectId };

    const todayString = new Date().toLocaleDateString("en-CA", {
      timeZone: "America/New_York",
    });

    // Fetch only the current page of jobs, but compute the stat-box numbers
    // (which span all jobs) in parallel so each box stays accurate.
    const [
      jobs,
      totalJobs,
      totalRejected,
      interviewsOngoing,
      jobsAppliedToday,
      appliedDates,
    ] = await Promise.all([
      Job.find(filter).sort({ dateApplied: -1 }).skip(skip).limit(limit),
      Job.countDocuments(filter),
      Job.countDocuments({ ...filter, status: "rejected" }),
      Job.countDocuments({ ...filter, status: "interview going on" }),
      Job.countDocuments({ ...filter, dateApplied: todayString }),
      Job.distinct("dateApplied", filter),
    ]);

    const streak = calculateStreak(appliedDates, todayString);

    res.status(200).json({
      jobs,
      jobsAppliedToday,
      totalRejected,
      interviewsOngoing,
      streak,
      totalJobs,
      totalPages: Math.ceil(totalJobs / limit) || 1,
      currentPage: page,
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
    const { page, limit, skip } = getPagination(req);

    const filter = {
      userId: objectId,
      companyName: {
        $regex: `^${query.trim()}`,
        $options: "i", // ✅ case-insensitive
      },
    };

    const [jobs, totalJobs] = await Promise.all([
      Job.find(filter).sort({ dateApplied: -1 }).skip(skip).limit(limit),
      Job.countDocuments(filter),
    ]);

    res.status(200).json({
      jobs,
      totalJobs,
      totalPages: Math.ceil(totalJobs / limit) || 1,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error searching jobs:", error);
    res.status(500).json({ error: "Error searching jobs" });
  }
};
