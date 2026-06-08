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
  "2026-05-23",
  "2026-05-24",
  "2026-05-25",
  "2026-05-17",
  "2026-05-16",
  "2026-05-03",
  "2026-05-02",
  "2026-05-01",
  "2026-04-30",
  "2026-04-29",
  "2026-04-28",
  "2026-04-27",
  "2026-04-20",
  "2026-04-09",
  "2026-04-06",
  "2026-04-05",
  "2026-04-04",
  "2026-04-02",

]);

// Counts weekdays (Mon–Fri) with at least one job applied, walking back from
// today. Weekends (Sat/Sun) and excluded dates are skipped and never break the
// streak. A single missed weekday is forgiven (it bridges the streak without
// adding to the count); two missed weekdays in a row break it. Today not having
// an application yet does not break it either.
export const calculateStreak = (appliedDates, todayString) => {
  const dates = new Set(
    appliedDates.map((d) => String(d).split("T")[0]).filter(Boolean)
  );

  const [ty, tm, td] = todayString.split("-").map(Number);
  // Anchor at noon UTC so day arithmetic is immune to timezone/DST shifts
  const cursor = new Date(Date.UTC(ty, tm - 1, td, 12));

  let streak = 0;
  let consecutiveMisses = 0; // run of missed weekdays since the last application
  for (let i = 0; i < 3650; i++) {
    const day = cursor.getUTCDay(); // 0 = Sun, 6 = Sat
    const cursorStr = cursor.toISOString().split("T")[0];

    if (EXCLUDED_DATES.has(cursorStr)) {
      // Manually excluded date: skip without breaking the streak
    } else if (dates.has(cursorStr)) {
      // An application on any day (incl. weekends) counts toward the streak
      streak += 1;
      consecutiveMisses = 0; // an application refills the one-day grace
    } else if (day === 0 || day === 6) {
      // Empty weekend: skip without breaking the streak
    } else if (cursorStr === todayString) {
      // No application yet today; the day isn't over, so don't break
    } else {
      // A missed weekday: forgive the first, break on the second in a row
      consecutiveMisses += 1;
      if (consecutiveMisses >= 2) break;
    }

    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
};

// Parses ?page & ?limit query params into safe, bounded values.
export const getPagination = (req) => {
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

    const todayString = new Date().toLocaleDateString("en-CA", {
      timeZone: "America/New_York",
    });

    // One round trip instead of six: $facet computes the current page and every
    // stat-box count (which span all jobs) in a single aggregation. The output
    // is shaped to match the previous Promise.all response exactly.
    const [result] = await Job.aggregate([
      { $match: { userId: objectId } },
      {
        $facet: {
          jobs: [{ $sort: { dateApplied: -1 } }, { $skip: skip }, { $limit: limit }],
          totalJobs: [{ $count: "count" }],
          totalRejected: [{ $match: { status: "rejected" } }, { $count: "count" }],
          interviewsOngoing: [
            { $match: { status: "interview going on" } },
            { $count: "count" },
          ],
          jobsAppliedToday: [
            { $match: { dateApplied: todayString } },
            { $count: "count" },
          ],
          appliedDates: [{ $group: { _id: "$dateApplied" } }],
        },
      },
    ]);

    const count = (facet) => facet[0]?.count ?? 0;
    const totalJobs = count(result.totalJobs);
    const appliedDates = result.appliedDates.map((d) => d._id);
    const streak = calculateStreak(appliedDates, todayString);

    res.status(200).json({
      jobs: result.jobs,
      jobsAppliedToday: count(result.jobsAppliedToday),
      totalRejected: count(result.totalRejected),
      interviewsOngoing: count(result.interviewsOngoing),
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

    const match = {
      userId: objectId,
      companyName: {
        $regex: `^${query.trim()}`,
        $options: "i", // ✅ case-insensitive
      },
    };

    // Single round trip for the page and its total (was two queries).
    const [result] = await Job.aggregate([
      { $match: match },
      {
        $facet: {
          jobs: [{ $sort: { dateApplied: -1 } }, { $skip: skip }, { $limit: limit }],
          totalJobs: [{ $count: "count" }],
        },
      },
    ]);

    const totalJobs = result.totalJobs[0]?.count ?? 0;

    res.status(200).json({
      jobs: result.jobs,
      totalJobs,
      totalPages: Math.ceil(totalJobs / limit) || 1,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error searching jobs:", error);
    res.status(500).json({ error: "Error searching jobs" });
  }
};
