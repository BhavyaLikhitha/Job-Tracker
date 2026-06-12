import { useState, useEffect } from "react";
import "./job.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const getTodayDate = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });

const JobTracker = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const navigate = useNavigate();
  const isMobileView = () => window.innerWidth <= 768; // Define mobile width threshold
  const [searchQuery, setSearchQuery] = useState(""); // ✅ ADD THIS
  const [newJob, setNewJob] = useState({
    companyName: "",
    dateApplied: getTodayDate(),
    jobTitle: "",
    // pay: "",
    status: "applied",
    source: "without referral", // Added field
    referralName: "",
    // url: "",
  });
  const [formVisible, setFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(null); // holds job._id when editing

  const token = localStorage.getItem("token"); // Assuming token is stored after login

  useEffect(() => {
    console.log("Jobs state changed:", jobs); // Log every time jobs state changes
  }, [jobs]);



  const [stats, setStats] = useState({
    totalJobs: 0,
    jobsAppliedToday: 0,
    totalRejected: 0,
    interviewsOngoing: 0,
    streak: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0); // bump to force a refetch
  const JOBS_PER_PAGE = 10;

  // Single source of truth for loading jobs. Refetches whenever the page or
  // search query changes, so we only ever pull 10 rows from the server at a
  // time. A blank search hits get-job (with stats); a query hits search-job.
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      const trimmed = searchQuery.trim();
      const base = "https://job-tracker-api-rho.vercel.app/api/jobs";
      const url =
        trimmed === ""
          ? `${base}/get-job?page=${currentPage}&limit=${JOBS_PER_PAGE}`
          : `${base}/search-job?query=${encodeURIComponent(
              trimmed
            )}&page=${currentPage}&limit=${JOBS_PER_PAGE}`;

      try {
        setLoading(true);
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setJobs(data.jobs);
          setTotalPages(data.totalPages || 1);
          // Stat boxes count ALL jobs, so only refresh them from the
          // unfiltered get-job response (search is scoped to a query).
          if (trimmed === "") {
            setStats({
              totalJobs: data.totalJobs ?? 0,
              jobsAppliedToday: data.jobsAppliedToday ?? 0,
              totalRejected: data.totalRejected ?? 0,
              interviewsOngoing: data.interviewsOngoing ?? 0,
              streak: data.streak ?? 0,
            });
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error("Fetch failed:", response.status, errorData);
          toast.error(
            errorData.error || `Failed to load jobs (${response.status})`
          );
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Error while loading jobs");
      } finally {
        setLoading(false);
      }
    };

    // Debounce only while typing a search; paging fires immediately.
    const delay = searchQuery.trim() === "" ? 0 : 300;
    const timeoutId = setTimeout(fetchData, delay);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, currentPage, token, refreshKey]);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob((prevJob) => ({
      ...prevJob,
      [name]: value,
      ...(name === "source" && value !== "referral" ? { referralName: "" } : {}),
    }));
  };

  const addJob = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      navigate("/signup");
      toast.error("Please sign up or log in to add a job.");
      return;
    }
  
    const requiresReferralName = newJob.source === "referral";

    if (
      newJob.companyName &&
      newJob.dateApplied &&
      newJob.jobTitle &&
      newJob.source &&
      (!requiresReferralName || newJob.referralName.trim())
    ) {
      try {
        console.log("Form data being sent:", newJob); // Debugging log

const formattedDateApplied = newJob.dateApplied; // Already in YYYY-MM-DD format
const jobData = {
  ...newJob,
  dateApplied: formattedDateApplied // Ensure only date part is sent
};


// newly added

            // const response = await fetch("http://localhost:3002/api/jobs/add-job", {
        const response = await fetch("https://job-tracker-api-rho.vercel.app/api/jobs/add-job", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Explicitly set content type for JSON
            Authorization: `Bearer ${token}`,
          },
          // body: JSON.stringify(newJob), // Send newJob as JSON
          
           body: JSON.stringify(jobData),
        });
  
        if (response.ok) {
          const addedJob = await response.json();
          console.log("Jobs fetched from backend:", addedJob);
          // Jump to the first page and refetch so the new job and updated
          // stat counts show up (the list is now server-paginated).
          setSearchQuery("");
          setCurrentPage(1);
          setRefreshKey((k) => k + 1);
          setNewJob({
            companyName: "",
            dateApplied: getTodayDate(),
            jobTitle: "",
            // pay: "",
            status: "applied",
            source:"without referral",
            referralName: "",
            // url: "",
          });
          setFormVisible(false); // Hide the form after adding the job
          toast.success("Job added successfully");
        } else {
          toast.error("Failed to add job");
        }
      } catch (error) {
        console.error("Error adding job:", error);
        toast.error("An error occurred while adding the job");
      }
    } else {
      toast.error("Please fill in all required fields");
    }
  };  

  
  const updateJobSponsorship = async (id, newSponsorship) => {
    try {
      const response = await fetch("https://job-tracker-api-rho.vercel.app/api/jobs/update-job-sponsorship", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId: id, sponsorship: newSponsorship }),
      });

      if (response.ok) {
        setJobs(jobs.map((job) =>
          job._id === id ? { ...job, sponsorship: newSponsorship } : job
        ));
        toast.success("Sponsorship updated");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update sponsorship");
      }
    } catch (error) {
      console.error("Error updating sponsorship:", error);
      toast.error("An error occurred while updating sponsorship");
    }
  };

  const updateJobStatus = async (id, newStatus) => {
    try {
          // const response = await fetch("http://localhost:3002/api/jobs/update-job-status", {
      const response = await fetch("https://job-tracker-api-rho.vercel.app/api/jobs/update-job-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId: id, status: newStatus }),
      });

      if (response.ok) {
        const updatedJobs = jobs.map((job) =>
          job._id === id ? { ...job, status: newStatus } : job
        );
        setJobs(updatedJobs); // Update the `jobs` state with the modified job
        setRefreshKey((k) => k + 1); // resync the stat counts (rejected/interviews)
        toast.success("Job status updated"); // Show a success toast
      } else {
        const errorData = await response.json(); // Parse error response
        console.log(errorData);
        toast.error(errorData.error || "Failed to update job status"); // Display error toast
      }
    } catch (error) {
      console.error("Error updating job status:", error);
      toast.error("An error occurred while updating the job status");
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      const response = await fetch(`https://job-tracker-api-rho.vercel.app/api/jobs/delete-job/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setJobs(jobs.filter((j) => j._id !== id));
        setRefreshKey((k) => k + 1);
        toast.success("Job deleted");
      } else {
        const err = await response.json();
        toast.error(err.error || "Failed to delete job");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("An error occurred while deleting the job");
    }
  };

  const handleEditClick = (job) => {
    setNewJob({
      companyName: job.companyName,
      dateApplied: job.dateApplied,
      jobTitle: job.jobTitle,
      status: job.status,
      source: job.source,
      referralName: job.referralName || "",
    });
    setEditMode(job._id);
    setFormVisible(true);
  };

  const handleSaveEdit = async () => {
    const requiresReferralName = newJob.source === "referral";
    if (
      !newJob.companyName ||
      !newJob.dateApplied ||
      !newJob.jobTitle ||
      !newJob.source ||
      (requiresReferralName && !newJob.referralName.trim())
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch(`https://job-tracker-api-rho.vercel.app/api/jobs/update-job/${editMode}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...newJob }),
      });

      if (response.ok) {
        const updatedJob = await response.json();
        setJobs(jobs.map((j) => (j._id === editMode ? updatedJob : j)));
        setRefreshKey((k) => k + 1);
        setFormVisible(false);
        setEditMode(null);
        setNewJob({
          companyName: "",
          dateApplied: getTodayDate(),
          jobTitle: "",
          status: "applied",
          source: "without referral",
          referralName: "",
        });
        toast.success("Job updated successfully");
      } else {
        const err = await response.json();
        toast.error(err.error || "Failed to update job");
      }
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("An error occurred while updating the job");
    }
  };

  const getStatusClass = (status) => {
    return `status-dropdown ${status.replace(/\s+/g, "-")}`;
  };

  const formatSourceLabel = (source) => {
    if (source === "referral") return "Referral";
    if (source === "without referral") return "Without Referral";
    return source;
  };

  const formatReferralDetails = (job) => {
    const sourceLabel = formatSourceLabel(job.source);

    if (job.source === "referral" && job.referralName) {
      return `${sourceLabel} - ${job.referralName}`;
    }

    return sourceLabel;
  };
  
  return (
    <div className="job-tracker">
      <div className="stats">
      <div className="stat-box jobs-applied-today">
  <h3>Jobs Applied Today</h3>
  <p>{stats.jobsAppliedToday}</p>
</div>

        <div className="stat-box">
          <h3>Total Jobs Applied</h3>
          <p>{stats.totalJobs}</p>
        </div>
        <div className="stat-box">
          <h3>Total Rejected</h3>
          <p>{stats.totalRejected}</p>
        </div>
        <div className="stat-box">
          <h3>Streak</h3>
          <p>{stats.streak}</p>
        </div>
        <div className="stat-box">
          <h3>Interviews Ongoing</h3>
          <p>{stats.interviewsOngoing}</p>
        </div>
      </div>
    <div className="job-actions">
<input
  type="text"
  placeholder="Search company"
  value={searchQuery}
  onChange={(e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // results may have fewer pages; start at the top
  }}
  className="search-input"
/>
  <button
    className="add"
    onClick={() => {
      if (token) {
        const next = !formVisible;
        setFormVisible(next);
        if (!next) {
          setEditMode(null);
          setNewJob({ companyName: "", dateApplied: getTodayDate(), jobTitle: "", status: "applied", source: "without referral", referralName: "" });
        }
      } else {
        toast.info("Please sign up or log in to add a job.");
        setTimeout(() => navigate("/signup"), 2000);
        return;
      }
    }}
  >
    {formVisible ? "Cancel" : "Add Job"}
  </button>
</div>

      {formVisible && (
        <div className="add-job">
          <div className="add-job-card">
            <div className="add-job-header">
              <h3>{editMode ? "Edit Job" : "Add New Job"}</h3>
              <p>{editMode ? "Update the job details below." : "Track each application with a cleaner, faster form."}</p>
            </div>
            <div className="add-job-grid">
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
            className="date-input"
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
          {/* <input
            type="text"
            name="pay"
            placeholder="Pay"
            value={newJob.pay}
            onChange={handleInputChange}
          /> */}
          <select name="source" value={newJob.source} onChange={handleInputChange}>
            <option value="" disabled>
              Referral Type
            </option>
            <option value="referral">Referral</option>
            <option value="without referral">Without Referral</option>
          </select>
          {newJob.source === "referral" && (
            <input
              type="text"
              name="referralName"
              placeholder="Referral Name"
              value={newJob.referralName}
              onChange={handleInputChange}
            />
          )}
          
          <select name="status" value={newJob.status} onChange={handleInputChange}>
            <option value="applied">📤 Applied</option>
            <option value="assessment">⏳ Assessment/OA</option>
            {/* <option value="no response">👻 No Response</option> */}
            <option value="rejected">❌ Rejected</option>
            <option value="interview going on">✅ Interview Going On</option>
            <option value="Job">🎉 Job</option>
          </select>
            </div>
          <button className="Last-Add-Job-Button" onClick={editMode ? handleSaveEdit : addJob}>
            {editMode ? "Save Changes" : "Add Job"}
          </button>
          </div>
        </div>
      )}

      {isMobileView() && token ? (
        <div className="no-jobs-message">
          <p>Hi! View your jobs list in desktop for better experience 😊</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="no-jobs-message">
          <p>😢 Uh oh! You haven&apos;t added any jobs to track yet. 😲</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Date Applied</th>
              <th>Job Title</th>
              {/* <th>Months</th> */}
              {/* <th>Pay</th> */}
              <th>Status</th>
              <th>Referral</th>
              <th>Sponsorship</th>
              {/* <th>URL</th> */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id}>
                <td>{job.companyName}</td>
                {/* <td>{job.dateApplied}</td> */}
<td>
  {job.dateApplied.split("-").slice(1).join("/") + "/" + job.dateApplied.split("-")[0]}
</td>


                <td>{job.jobTitle}</td>
                {/* <td>{job.months}</td> */}
                {/* <td>{job.pay}</td> */}
                <td>
                  <select
                    className={getStatusClass(job.status)}
                    value={job.status}
                    onChange={(e) => updateJobStatus(job._id, e.target.value)}
                  >
                    <option value="applied">📤 Applied</option>
                    <option value="assessment">⏳ Assessment/OA</option>
                    {/* <option value="no response">👻 No Response</option> */}
                    <option value="rejected">❌ Rejected</option>
                    <option value="interview going on">✅ Interview Going On</option>
                    <option value="Job">🎉 Job</option>
                  </select>
                </td>
                <td>{formatReferralDetails(job)}</td>
                <td>
                  <select
                    className={`sponsorship-dropdown ${job.sponsorship === "no" ? "sponsorship-no" : "sponsorship-yes"}`}
                    value={job.sponsorship ?? "yes"}
                    onChange={(e) => updateJobSponsorship(job._id, e.target.value)}
                  >
                    <option value="yes">✅ Yes</option>
                    <option value="no">❌ No</option>
                  </select>
                </td>
                <td className="action-cell">
                  <button className="action-btn edit-btn" onClick={() => handleEditClick(job)} title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button className="action-btn delete-btn" onClick={() => handleDeleteJob(job._id)} title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6"/><path d="M14 11v6"/>
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                </td>
{/* <td>
  {(() => {
    const raw = (job.url ?? "").trim();

    const isValidHttpUrl = (s) => {
      try {
        const u = new URL(s);
        return (u.protocol === "http:" || u.protocol === "https:") && !/\s/.test(s);
      } catch {
        return false;
      }
    };

    return isValidHttpUrl(raw) ? (
      <a href={raw} target="_blank" rel="noopener noreferrer">
        Link
      </a>
    ) : (
      <span>No URL</span>
    );
  })()}
</td> */}

              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!isMobileView() && token && totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage <= 1 || loading}
          >
            ← Prev
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="page-btn"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage >= totalPages || loading}
          >
            Next →
          </button>
        </div>
      )}
      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default JobTracker;


