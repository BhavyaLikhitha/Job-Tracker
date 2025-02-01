// import React, { useState, useEffect } from "react";
// import "./job.css";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// const JobTracker = () => {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true); // State for loading indicator
//   const navigate = useNavigate();
//   const isMobileView = () => window.innerWidth <= 768; // Define mobile width threshold
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

//   const userId = localStorage.getItem("userId"); // Assuming userId is stored after login
//   const token = localStorage.getItem("token"); // Assuming token is stored after login
//   useEffect(() => {
//     console.log("Jobs state changed:", jobs); // Log every time jobs state changes
//   }, [jobs]);
  
//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         console.log("Token:", token); // Debugging token
//         // const response = await fetch("http://localhost:3002/api/jobs/get-job", {
//           const response = await fetch("https://job-tracker-api-rho.vercel.app/api/jobs/get-job", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
  
//         console.log("Response Status:", response.status); // Debug response status
  
//         if (response.ok) {
//           const data = await response.json();
//           console.log("Jobs fetched from backend:", data); // Debug fetched jobs
//           setJobs(data); // Update jobs state
//         } else {
//           const errorData = await response.json();
//           console.error("Error response:", errorData); // Debug error response
//           toast.error(errorData.error || "Failed to fetch jobs");
//         }
//       } catch (error) {
//         console.error("Error fetching jobs:", error);
//         toast.error("An error occurred while fetching jobs");
//       } finally {
//         setLoading(false); // Ensure loading state is updated
//       }
//     };
  
//     if (token) {
//       fetchJobs();
//     } else {
//       setLoading(false);
//     }
//   }, [token]);
  
  
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewJob({ ...newJob, [name]: value });
//   };

//   const handleFileChange = (e) => {
//     setNewJob({ ...newJob, resume: e.target.files[0] });
//   };

//   const addJob = async () => {
//     const token = localStorage.getItem("token");

//   if (!token) {
//     // Redirect to signup page if the user is not logged in
//     navigate("/signup");
//     toast.error("Please sign up or log in to add a job.");
//     return;
//   }

//     if (newJob.companyName && newJob.dateApplied && newJob.jobTitle) {
//       try {
//         const formData = new FormData();
//         formData.append("companyName", newJob.companyName);
//         formData.append("dateApplied", newJob.dateApplied);
//         formData.append("jobTitle", newJob.jobTitle);
//         formData.append("months", newJob.months);
//         formData.append("pay", newJob.pay);
//         formData.append("status", newJob.status);
//         formData.append("url", newJob.url);
//         if (newJob.resume) {
//           console.log("Adding file:", newJob.resume);
//           formData.append("resume", newJob.resume);
//         }
//         formData.append("userId", userId);

//         // const response = await fetch("http://localhost:3002/api/jobs/add-job", {
//           const response = await fetch("https://job-tracker-api-rho.vercel.app/api/jobs/add-job", {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: formData,
//         });

//         if (response.ok) {
//           const addedJob = await response.json();
//           console.log("Jobs fetched from backend:", addedJob);
//           setJobs([...jobs, addedJob]); // Add the new job to the state
//           setNewJob({
//             companyName: "",
//             dateApplied: "",
//             jobTitle: "",
//             months: "",
//             pay: "",
//             status: "applied",
//             url: "",
//             resume: null,
//           });
//           setFormVisible(false); // Hide the form after adding the job
//           toast.success("Job added successfully");
//         } else {
//           toast.error("Failed to add job");
//         }
//       } catch (error) {
        
//         console.log("Error adding job:", error);
//         toast.error("An error occurred while adding the job");
//       }
//     } else {
//       toast.error("Please fill in all required fields");
//     }
//   };
  
//   const updateJobStatus = async (id, newStatus) => {
//     try {
//       // Make a PUT request to the backend to update the job status
//       // const response = await fetch("http://localhost:3002/api/jobs/update-job-status", {
//         const response = await fetch("https://job-tracker-api-rho.vercel.app/api/jobs/update-job-status", {
//         method: "PUT", // Correct method
//         headers: {
//           "Content-Type": "application/json", // Correct Content-Type for JSON data
//           Authorization: `Bearer ${token}`, // Token is correctly added to Authorization header
//         },
//         body: JSON.stringify({ jobId: id, status: newStatus }), // Sending jobId and status in the body
//       });
  
//       if (response.ok) {
//         // Update the local state if the response is successful
//         const updatedJobs = jobs.map((job) =>
//           job._id === id ? { ...job, status: newStatus } : job
//         );
//         setJobs(updatedJobs); // Update the `jobs` state with the modified job
//         toast.success("Job status updated"); // Show a success toast
//       } else {
//         const errorData = await response.json(); // Parse error response
//         console.log(errorData);
//         toast.error(errorData.error || "Failed to update job status"); // Display error toast
//       }
//     } catch (error) {
//       // Catch and handle any errors that occur during the fetch
//       console.error("Error updating job status:", error);
//       toast.error("An error occurred while updating the job status");
//     }
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
//           <p>{jobs.filter((job) => job.status === "interview going on").length}</p>
//         </div>
//       </div>
  
//       <button
//         onClick={() => {
//           if (token) {
//             setFormVisible(!formVisible);
//           } else {
//             toast.info("Please sign up or log in to add a job.");
//             setTimeout(() => navigate("/signup"), 2000);
//             return;
//           }
//         }}
//       >
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
  
//       {isMobileView() && token ? (
//         <div className="no-jobs-message">
//           <p>Hi! View your jobs list in desktop for better experience 😊</p>
//         </div>
//       ) : jobs.length === 0 ? (
//         <div className="no-jobs-message">
//           <p>😢 Uh oh! You haven't added any jobs to track yet. 😲</p>
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
//               <tr key={job._id}>
//                 <td>{job.companyName}</td>
//                 <td>{new Date(job.dateApplied).toLocaleDateString()}</td>
//                 <td>{job.jobTitle}</td>
//                 <td>{job.months}</td>
//                 <td>{job.pay}</td>
//                 <td>
//                   <select
//                     className={getStatusClass(job.status)}
//                     value={job.status}
//                     onChange={(e) => updateJobStatus(job._id, e.target.value)}
//                   >
//                     <option value="applied">📤 Applied</option>
//                     <option value="ghosted">👻 Ghosted</option>
//                     <option value="no response">⏳ No Response</option>
//                     <option value="rejected">❌ Rejected</option>
//                     <option value="interview going on">✅ Interview Going On</option>
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
//                       href={`https://job-tracker-api-rho.vercel.app/api/jobs/download/${job.resume}`}
//                       download
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
//       <ToastContainer autoClose={3000} />
//     </div>
//   );
  
// };

// export default JobTracker;
import React, { useState, useEffect } from "react";
import "./job.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const JobTracker = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const navigate = useNavigate();
  const isMobileView = () => window.innerWidth <= 768; // Define mobile width threshold
  
  const [newJob, setNewJob] = useState({
    companyName: "",
    dateApplied: "",
    jobTitle: "",
    months: "",
    pay: "",
    status: "applied",
    source: "", // Added field
    url: "",
  });
  const [formVisible, setFormVisible] = useState(false);

  const userId = localStorage.getItem("userId"); // Assuming userId is stored after login
  const token = localStorage.getItem("token"); // Assuming token is stored after login

  useEffect(() => {
    console.log("Jobs state changed:", jobs); // Log every time jobs state changes
  }, [jobs]);

  // useEffect(() => {
  //   const fetchJobs = async () => {
  //     try {
  //       console.log("Token:", token); // Debugging token
  //       const response = await fetch("https://job-tracker-api-rho.vercel.app/api/jobs/get-job", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       console.log("Response Status:", response.status); // Debug response status

  //       if (response.ok) {
  //         const data = await response.json();
  //         console.log("Jobs fetched from backend:", data); // Debug fetched jobs
  //         setJobs(data); // Update jobs state
  //       } else {
  //         const errorData = await response.json();
  //         console.error("Error response:", errorData); // Debug error response
  //         toast.error(errorData.error || "Failed to fetch jobs");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching jobs:", error);
  //       toast.error("An error occurred while fetching jobs");
  //     } finally {
  //       setLoading(false); // Ensure loading state is updated
  //     }
  //   };

  //   if (token) {
  //     fetchJobs();
  //   } else {
  //     setLoading(false);
  //   }
  // }, [token]);
  const [jobsAppliedToday, setJobsAppliedToday] = useState(0);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        console.log("Token:", token); // Debugging token
        const response = await fetch("https://job-tracker-api-rho.vercel.app/api/jobs/get-job", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response Status:", response.status); // Debug response status

        if (response.ok) {
          const data = await response.json();
          console.log("Jobs fetched from backend:", data); // Debug fetched jobs
          setJobs(data.jobs); // Update jobs state // Added this line for clarity
          setJobsAppliedToday(data.jobsAppliedToday); // Store count of today's applications // Added this line for clarity
        } else {
          const errorData = await response.json();
          console.error("Error response:", errorData); // Debug error response
          toast.error(errorData.error || "Failed to fetch jobs");
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("An error occurred while fetching jobs");
      } finally {
        setLoading(false); // Ensure loading state is updated
      }
    };

    if (token) {
      fetchJobs();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob({ ...newJob, [name]: value });
  };

  const addJob = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      navigate("/signup");
      toast.error("Please sign up or log in to add a job.");
      return;
    }
  
    if (newJob.companyName && newJob.dateApplied && newJob.jobTitle) {
      try {
        console.log("Form data being sent:", newJob); // Debugging log

        // newly added

        const formattedDateApplied = new Date(newJob.dateApplied).toISOString().split("T")[0];

const jobData = {
  ...newJob,
  dateApplied: formattedDateApplied, // Ensure only date part is sent
};

// newly added

  
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
          setJobs([...jobs, addedJob]); // Add the new job to the state
          setNewJob({
            companyName: "",
            dateApplied: "",
            jobTitle: "",
            months: "" || "",
            pay: "" || "",
            status: "applied",
            source:"",
            url: "" || "",
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

  const getStatusClass = (status) => {
    return `status-dropdown ${status.replace(/\s+/g, "-")}`;
  };
  
  return (
    <div className="job-tracker">
      <div className="stats">
      <div className="stat-box jobs-applied-today">
  <h3>Jobs Applied Today</h3>
  <p>{jobsAppliedToday}</p>
</div>

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

      <button
        onClick={() => {
          if (token) {
            setFormVisible(!formVisible);
          } else {
            toast.info("Please sign up or log in to add a job.");
            setTimeout(() => navigate("/signup"), 2000);
            return;
          }
        }}
      >
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
  type="text"
  name="source"
  placeholder="Job Source"
  value={newJob.source}
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
          <button onClick={addJob}>Add Job</button>
        </div>
      )}

      {isMobileView() && token ? (
        <div className="no-jobs-message">
          <p>Hi! View your jobs list in desktop for better experience 😊</p>
        </div>
      ) : jobs.length === 0 ? (
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
              <th>Source</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id}>
                <td>{job.companyName}</td>
                {/* <td>{new Date(job.dateApplied).toLocaleDateString()}</td> */}
                {/* <td>{formatDateToEST(job.dateApplied)}</td> */}
                <td>{new Date(job.dateApplied).toISOString().split("T")[0]}</td>

                {/* <td>{job.dateApplied}</td> */}

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
                <td>{job.source}</td>
                <td>
                  <a href={job.url} target="_blank" rel="noopener noreferrer">
                    Link
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default JobTracker;


