import React, { useState } from "react";
import axios from "axios";
import "./Form.css";

const Form = ({ job, closeForm }) => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    experience: "",
    resume: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "resume") {
      setFormData({ ...formData, resume: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("experience", formData.experience);
    data.append("resume", formData.resume);
    data.append("jobId", job.id);

    try {

      await axios.post("http://localhost:5000/api/candidates", data);

      alert("Application Submitted Successfully");

      closeForm(); // close popup

    } catch (error) {
      alert("Error submitting application");
    }
  };

  return (

    <div className="popup-overlay">

      <div className="popup-container">

        <h2>Apply for {job.title}</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            onChange={handleChange}
          />

          <input
            type="number"
            name="experience"
            placeholder="Experience (years)"
            onChange={handleChange}
          />

         <label className="upload-btn">
  Upload Resume
  <input
    type="file"
    name="resume"
    required
    onChange={handleChange}
    hidden
  />
</label>

{formData.resume && (
  <p className="file-name">{formData.resume.name}</p>
)}

         <div className="button-group">

  <button type="submit" className="submit-btn">
    Submit
  </button>

  <button
    type="button"
    className="close-btn"
    onClick={closeForm}
  >
    Cancel
  </button>

</div>

        </form>

      </div>

    </div>
  );
};

export default Form;