// routes/jobs.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Add a new job
router.post("/", (req, res) => {
  const { title, description, skills, experience_required } = req.body;
  db.query(
    "INSERT INTO jobs (title, description, skills, experience_required) VALUES (?,?,?,?)",
    [title, description, skills, experience_required],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json({ message: "Job added successfully", jobId: result.insertId });
    }
  );
});

// Get all jobs
router.get("/", (req, res) => {
  db.query("SELECT * FROM jobs", (err, jobs) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(jobs);
  });
});

module.exports = router;