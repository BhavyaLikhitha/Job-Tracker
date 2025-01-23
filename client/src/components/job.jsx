// import React, { useState } from "react";
// import "./job.css";

// const JobTracker = () => {
//   const [jobs, setJobs] = useState([]);
//   const [newJob, setNewJob] = useState({
//     companyName: "",
//     dateApplied: "",
//     jobTitle: "",
//     months: "",
//     pay: "",
//     status: "applied",
//     url: "",
//     resume: null,
//   });
//   const [formVisible, setFormVisible] = useState(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewJob({ ...newJob, [name]: value });
//   };

//   const handleFileChange = (e) => {
//     setNewJob({ ...newJob, resume: e.target.files[0] });
//   };

//   const addJob = () => {
//     if (newJob.companyName && newJob.dateApplied && newJob.jobTitle) {
//       setJobs([...jobs, { ...newJob, id: Date.now() }]); // Assign a unique ID to each job
//       setNewJob({
//         companyName: "",
//         dateApplied: "",
//         jobTitle: "",
//         months: "",
//         pay: "",
//         status: "applied",
//         url: "",
//         resume: null,
//       });
//       setFormVisible(false); // Hide the form after adding the job
//     } else {
//       alert("Please fill in all required fields.");
//     }
//   };

//   const updateJobStatus = (id, newStatus) => {
//     const updatedJobs = jobs.map((job) =>
//       job.id === id ? { ...job, status: newStatus } : job
//     );
//     setJobs(updatedJobs);
//   };

//   const getStatusClass = (status) => {
//     return `status-dropdown ${status.replace(/\s+/g, "-")}`;
//   };

//   return (
//     <div className="job-tracker">
//       <div className="stats">
//         <div className="stat-box">
//           <h3>Total Jobs Applied</h3>
//           <p>{jobs.length}</p>
//         </div>
//         <div className="stat-box">
//           <h3>Total Rejected</h3>
//           <p>{jobs.filter((job) => job.status === "rejected").length}</p>
//         </div>
//         <div className="stat-box">
//           <h3>Awaiting Response</h3>
//           <p>
//             {jobs.filter(
//               (job) =>
//                 job.status === "applied" ||
//                 job.status === "no response" ||
//                 job.status === "ghosted"
//             ).length}
//           </p>
//         </div>
//         <div className="stat-box">
//           <h3>Interviews Ongoing</h3>
//           <p>
//             {jobs.filter((job) => job.status === "interview going on").length}
//           </p>
//         </div>
//       </div>

//       <button onClick={() => setFormVisible(!formVisible)}>
//         {formVisible ? "Cancel" : "Add Job"}
//       </button>

//       {formVisible && (
//         <div className="add-job">
//           <input
//             type="text"
//             name="companyName"
//             placeholder="Company Name"
//             value={newJob.companyName}
//             onChange={handleInputChange}
//           />
//           <input
//             type="date"
//             name="dateApplied"
//             value={newJob.dateApplied}
//             onChange={handleInputChange}
//           />
//           <input
//             type="text"
//             name="jobTitle"
//             placeholder="Job Title"
//             value={newJob.jobTitle}
//             onChange={handleInputChange}
//           />
//           <input
//             type="number"
//             name="months"
//             placeholder="Months"
//             value={newJob.months}
//             onChange={handleInputChange}
//           />
//           <input
//             type="number"
//             name="pay"
//             placeholder="Pay"
//             value={newJob.pay}
//             onChange={handleInputChange}
//           />
//           <input
//             type="url"
//             name="url"
//             placeholder="Job Description URL"
//             value={newJob.url}
//             onChange={handleInputChange}
//           />
//           <select name="status" value={newJob.status} onChange={handleInputChange}>
//             <option value="applied">📤 Applied</option>
//             <option value="ghosted">👻 Ghosted</option>
//             <option value="no response">⏳ No Response</option>
//             <option value="rejected">❌ Rejected</option>
//             <option value="interview going on">✅ Interview Going On</option>
//             <option value="Job">🎉 Job</option>
//           </select>
//           <input type="file" onChange={handleFileChange} />
//           <button onClick={addJob}>Add Job</button>
//         </div>
//       )}

//       {jobs.length === 0 ? (
//         <div className="no-jobs-message">
//           <p>
//           😢 Uh oh! You haven't added any jobs to track yet. 😲
//           </p>
//         </div>
//       ) : (
//         <table>
//           <thead>
//             <tr>
//               <th>Company Name</th>
//               <th>Date Applied</th>
//               <th>Job Title</th>
//               <th>Months</th>
//               <th>Pay</th>
//               <th>Status</th>
//               <th>URL</th>
//               <th>Resume</th>
//             </tr>
//           </thead>
//           <tbody>
//             {jobs.map((job) => (
//               <tr key={job.id}>
//                 <td>{job.companyName}</td>
//                 <td>{job.dateApplied}</td>
//                 <td>{job.jobTitle}</td>
//                 <td>{job.months}</td>
//                 <td>{job.pay}</td>
//                 <td>
//                   <select
//                     className={getStatusClass(job.status)}
//                     value={job.status}
//                     onChange={(e) => updateJobStatus(job.id, e.target.value)}
//                   >
//                     <option value="applied">📤 Applied</option>
//                     <option value="ghosted">👻 Ghosted</option>
//                     <option value="no response">⏳ No Response</option>
//                     <option value="rejected">❌ Rejected</option>
//                     <option value="interview going on">
//                       ✅ Interview Going On
//                     </option>
//                     <option value="Job">🎉 Job</option>
//                   </select>
//                 </td>
//                 <td>
//                   <a href={job.url} target="_blank" rel="noopener noreferrer">
//                     Link
//                   </a>
//                 </td>
//                 <td>
//                   {job.resume ? (
//                     <a
//                       href={URL.createObjectURL(job.resume)}
//                       download={job.resume.name}
//                     >
//                       Download
//                     </a>
//                   ) : (
//                     "No File Uploaded"
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default JobTracker;
import React, { useState, useEffect } from "react";
import "./job.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JobTracker = () => {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    companyName: "",
    dateApplied: "",
    jobTitle: "",
    months: "",
    pay: "",
    status: "applied",
    url: "",
    resume: null,
  });
  const [formVisible, setFormVisible] = useState(false);

  const userId = localStorage.getItem("userId"); // Assuming userId is stored after login
  const token = localStorage.getItem("token"); // Assuming token is stored after login

  // Fetch jobs when the component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`http://localhost:3002/api/users/jobs/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setJobs(data); // Populate the jobs array with data from the backend
        } else {
          toast.error("Failed to fetch jobs");
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("An error occurred while fetching jobs");
      }
    };

    if (userId) {
      fetchJobs();
    }
  }, [userId, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob({ ...newJob, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewJob({ ...newJob, resume: e.target.files[0] });
  };

  const addJob = async () => {
    if (newJob.companyName && newJob.dateApplied && newJob.jobTitle) {
      try {
        const formData = new FormData();
        formData.append("companyName", newJob.companyName);
        formData.append("dateApplied", newJob.dateApplied);
        formData.append("jobTitle", newJob.jobTitle);
        formData.append("months", newJob.months);
        formData.append("pay", newJob.pay);
        formData.append("status", newJob.status);
        formData.append("url", newJob.url);
        if (newJob.resume) {
          formData.append("resume", newJob.resume);
        }
        formData.append("userId", userId);

        const response = await fetch("http://localhost:3002/api/users/add-job", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          const addedJob = await response.json();
          setJobs([...jobs, addedJob]); // Add the new job to the state
          setNewJob({
            companyName: "",
            dateApplied: "",
            jobTitle: "",
            months: "",
            pay: "",
            status: "applied",
            url: "",
            resume: null,
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

  const updateJobStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3002/api/users/update-job-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, jobId: id, status: newStatus }),
      });

      if (response.ok) {
        const updatedJobs = jobs.map((job) =>
          job._id === id ? { ...job, status: newStatus } : job
        );
        setJobs(updatedJobs);
        toast.success("Job status updated");
      } else {
        toast.error("Failed to update job status");
      }
    } catch (error) {
      console.error("Error updating job status:", error);
      toast.error("An error occurred while updating the job status");
    }
  };

  const getStatusClass = (status) => {
    return `status-dropdown ${status.replace(/\s+/g, "-")}`;
  };

  return (
    <div className="job-tracker">
      <div className="stats">
        <div className="stat-box">
          <h3>Total Jobs Applied</h3>
          <p>{jobs.length}</p>
        </div>
        <div className="stat-box">
          <h3>Total Rejected</h3>
          <p>{jobs.filter((job) => job.status === "rejected").length}</p>
        </div>
        <div className="stat-box">
          <h3>Awaiting Response</h3>
          <p>
            {jobs.filter(
              (job) =>
                job.status === "applied" ||
                job.status === "no response" ||
                job.status === "ghosted"
            ).length}
          </p>
        </div>
        <div className="stat-box">
          <h3>Interviews Ongoing</h3>
          <p>{jobs.filter((job) => job.status === "interview going on").length}</p>
        </div>
      </div>

      <button onClick={() => setFormVisible(!formVisible)}>
        {formVisible ? "Cancel" : "Add Job"}
      </button>

      {formVisible && (
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
          <input
            type="number"
            name="pay"
            placeholder="Pay"
            value={newJob.pay}
            onChange={handleInputChange}
          />
          <input
            type="url"
            name="url"
            placeholder="Job Description URL"
            value={newJob.url}
            onChange={handleInputChange}
          />
          <select name="status" value={newJob.status} onChange={handleInputChange}>
            <option value="applied">📤 Applied</option>
            <option value="ghosted">👻 Ghosted</option>
            <option value="no response">⏳ No Response</option>
            <option value="rejected">❌ Rejected</option>
            <option value="interview going on">✅ Interview Going On</option>
            <option value="Job">🎉 Job</option>
          </select>
          <input type="file" onChange={handleFileChange} />
          <button onClick={addJob}>Add Job</button>
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="no-jobs-message">
          <p>😢 Uh oh! You haven't added any jobs to track yet. 😲</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Date Applied</th>
              <th>Job Title</th>
              <th>Months</th>
              <th>Pay</th>
              <th>Status</th>
              <th>URL</th>
              <th>Resume</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id}>
                <td>{job.companyName}</td>
                <td>{job.dateApplied}</td>
                <td>{job.jobTitle}</td>
                <td>{job.months}</td>
                <td>{job.pay}</td>
                <td>
                  <select
                    className={getStatusClass(job.status)}
                    value={job.status}
                    onChange={(e) => updateJobStatus(job._id, e.target.value)}
                  >
                    <option value="applied">📤 Applied</option>
                    <option value="ghosted">👻 Ghosted</option>
                    <option value="no response">⏳ No Response</option>
                    <option value="rejected">❌ Rejected</option>
                    <option value="interview going on">✅ Interview Going On</option>
                    <option value="Job">🎉 Job</option>
                  </select>
                </td>
                <td>
                  <a href={job.url} target="_blank" rel="noopener noreferrer">
                    Link
                  </a>
                </td>
                <td>
                  {job.resume ? (
                    <a href={`http://localhost:3002/api/users/download/${job.resume}`} download>
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
      )}
      <ToastContainer />
    </div>
  );
};

export default JobTracker;
