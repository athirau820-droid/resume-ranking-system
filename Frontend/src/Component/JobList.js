import React, { useState, useEffect } from "react";
import axios from "axios";
import Form from "./Form";
import "./Form.css";

const JobList = () => {

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/jobs")
      .then(res => setJobs(res.data))
      .catch(err => console.log(err));
  }, []);

  const openForm = (job) => {
    setSelectedJob(job);
  };

  const closeForm = () => {
    setSelectedJob(null);
  };

  return (

    <div className="job-page">

      <h2 className="job-title">Available Jobs</h2>

      <div className="job-container">

        {jobs.map((job) => (

          <div key={job.id} className="job-card">

            <h3>{job.title}</h3>

            <p>{job.description}</p>

            <p><b>Skills:</b> {job.skills}</p>

            <p><b>Experience:</b> {job.experience_required} years</p>

            <button
              className="apply-btn"
              onClick={() => openForm(job)}
            >
              Apply
            </button>

          </div>

        ))}

      </div>

      {selectedJob && (
        <Form job={selectedJob} closeForm={closeForm}/>
      )}

    </div>

  );

};

export default JobList;