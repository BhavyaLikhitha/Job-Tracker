import React, { useState } from "react";
import "./job.css";

const JobTracker = () => {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    companyName: "",
    dateApplied: "",
    jobTitle: "",
    months: "",
    status: "applied",
    url: "",
    resume: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob({ ...newJob, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewJob({ ...newJob, resume: e.target.files[0] });
  };

  const addJob = () => {
    if (newJob.companyName && newJob.dateApplied && newJob.jobTitle) {
      setJobs([...jobs, { ...newJob, id: Date.now() }]); // Assign a unique ID to each job
      setNewJob({
        companyName: "",
        dateApplied: "",
        jobTitle: "",
        months: "",
        status: "applied",
        url: "",
        resume: null,
      });
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const updateJobStatus = (id, newStatus) => {
    const updatedJobs = jobs.map((job) =>
      job.id === id ? { ...job, status: newStatus } : job
    );
    setJobs(updatedJobs);
  };

  return (
    <div className="job-tracker">
      <table>
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Date Applied</th>
            <th>Job Title</th>
            <th>Months</th>
            <th>Status</th>
            <th>URL</th>
            <th>Resume</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.companyName}</td>
              <td>{job.dateApplied}</td>
              <td>{job.jobTitle}</td>
              <td>{job.months}</td>
              <td>
                <select
                  value={job.status}
                  onChange={(e) => updateJobStatus(job.id, e.target.value)}
                >
                  <option value="applied">Applied</option>
                  <option value="ghosted">Ghosted</option>
                  <option value="no response">No Response</option>
                  <option value="rejected">Rejected</option>
                  <option value="interview going on">Interview Going On</option>
                </select>
              </td>
              <td>
                <a href={job.url} target="_blank" rel="noopener noreferrer">
                  Link
                </a>
              </td>
              <td>
                {job.resume ? (
                  <a
                    href={URL.createObjectURL(job.resume)}
                    download={job.resume.name}
                  >
                    Download
                  </a>
                ) : (
                  "No File Uploaded"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="add-job">
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={newJob.companyName}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="dateApplied"
          value={newJob.dateApplied}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="jobTitle"
          placeholder="Job Title"
          value={newJob.jobTitle}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="months"
          placeholder="Months"
          value={newJob.months}
          onChange={handleInputChange}
        />
        <select name="status" value={newJob.status} onChange={handleInputChange}>
          <option value="applied">Applied</option>
          <option value="ghosted">Ghosted</option>
          <option value="no response">No Response</option>
          <option value="rejected">Rejected</option>
          <option value="interview going on">Interview Going On</option>
        </select>
        <input
          type="url"
          name="url"
          placeholder="Job Description URL"
          value={newJob.url}
          onChange={handleInputChange}
        />
        <input type="file" onChange={handleFileChange} />
        <button onClick={addJob}>Add Job</button>
      </div>
    </div>
  );
};

export default JobTracker;
