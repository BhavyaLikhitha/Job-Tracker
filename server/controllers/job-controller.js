import Job from "../models/Job.js";

export const addJob = async (req, res) => {
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
    });

    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error adding job" });
  }
};

export const getJobs = async (req, res) => {
  const { userId } = req.user;

  try {
    const jobs = await Job.find({ userId });
    res.status(200).json(jobs);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error fetching jobs" });
  }
};

export const downloadResume = (req, res) => {
  const { fileName } = req.params;
  const filePath = `uploads/${fileName}`;
  res.download(filePath, (err) => {
    if (err) {
        console.log(error)
      res.status(500).json({ error: "Error downloading file" });
    }
  });
};
