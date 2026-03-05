import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Admin.css";

const Admin = () => {
  const [jobs, setJobs] = useState([]);
  const [showAddJobForm, setShowAddJobForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");

  // Track candidates per job
  const [jobCandidates, setJobCandidates] = useState({});
  // Track expanded/collapsed state per job
  const [expandedJobs, setExpandedJobs] = useState({});
  const [loadingJobs, setLoadingJobs] = useState({});

  // Fetch all jobs
  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Add job
  const addJob = async () => {
    if (!title || !description || !skills || !experience) {
      return alert("Please fill all fields!");
    }
    try {
      await axios.post("http://localhost:5000/api/jobs", {
        title,
        description,
        skills,
        experience_required: Number(experience),
      });
      alert("Job added successfully!");
      setTitle(""); setDescription(""); setSkills(""); setExperience("");
      setShowAddJobForm(false);
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert("Error adding job");
    }
  };

  // Toggle candidate view for a job
  const toggleCandidates = async (jobId) => {
    // If already expanded, collapse it
    if (expandedJobs[jobId]) {
      setExpandedJobs(prev => ({ ...prev, [jobId]: false }));
      return;
    }

    // Otherwise, fetch candidates if not already fetched
    if (!jobCandidates[jobId]) {
      setLoadingJobs(prev => ({ ...prev, [jobId]: true }));
      try {
        const res = await axios.get(`http://localhost:5000/api/analyze/${jobId}`);
        setJobCandidates(prev => ({ ...prev, [jobId]: res.data }));
      } catch (err) {
        console.error(err);
        alert("Error fetching candidates");
      }
      setLoadingJobs(prev => ({ ...prev, [jobId]: false }));
    }

    // Expand the job
    setExpandedJobs(prev => ({ ...prev, [jobId]: true }));
  };

  return (
    <div className="admin-container">
      <h2 className="admin-heading">Admin Dashboard</h2>

      {/* Add Job Button */}
      <button className="btn-toggle-admin" onClick={() => setShowAddJobForm(!showAddJobForm)}>
        {showAddJobForm ? "Close Add Job Form" : "Add Job"}
      </button>

      {/* Add Job Form */}
      {showAddJobForm && (
        <div className="job-section">
          <input type="text" placeholder="Job Title" value={title} onChange={e => setTitle(e.target.value)} className="input-field" />
          <textarea placeholder="Job Description" value={description} onChange={e => setDescription(e.target.value)} className="textarea-field" />
          <input type="text" placeholder="Skills (comma separated)" value={skills} onChange={e => setSkills(e.target.value)} className="input-field" />
          <input type="number" placeholder="Required Experience (years)" value={experience} onChange={e => setExperience(e.target.value)} className="input-field" />
          <button onClick={addJob} className="btn-add-job">Submit Job</button>
        </div>
      )}

      {/* All Jobs */}
      <div className="job-section">
        <h3>All Jobs</h3>
        {jobs.map(job => (
          <div key={job.id} className="card">
            <h4 className="card-title">{job.title}</h4>
            <p>{job.description}</p>
            <p><strong>Skills:</strong> {job.skills}</p>
            <p><strong>Experience Required:</strong> {job.experience_required} yrs</p>
            <button onClick={() => toggleCandidates(job.id)} className="btn-view-candidates">
              {expandedJobs[job.id] ? "Hide Candidates" : "View Candidates"}
            </button>

            {/* Candidate List (toggleable) */}
            {expandedJobs[job.id] && (
              <>
                {loadingJobs[job.id] && <p>Loading candidates...</p>}
                {jobCandidates[job.id] && jobCandidates[job.id].length > 0 ? (
                  <div className="candidate-section scrollable">
                    {jobCandidates[job.id].map((c, index) => (
                      <div key={c.id} className="candidate-card">
                        <h4>Rank #{index + 1}</h4>
                        <p><strong>Name:</strong> {c.name}</p>
                        <p><strong>Email:</strong> {c.email}</p>
                        <p><strong>Experience:</strong> {c.experience} yrs</p>
                        <p>
                          <strong>Skills Matched:</strong>{" "}
                          {c.skillsMatched.length > 0 ? c.skillsMatched.join(", ") : "No skills matched"}
                        </p>
                        <p>
                          <strong>ATS Score:</strong>{" "}
                          <span className={`ats-score ${c.atsScore >= 70 ? "high" : c.atsScore >= 40 ? "medium" : "low"}`}>
                            {c.atsScore}%
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No candidates applied yet.</p>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;