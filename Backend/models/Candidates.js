const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: String,
  email: String,
  resume: String,             // file path
  skills: [String],           // optional: extracted from resume
  experience: Number,         // optional: candidate experience
  atsScore: { type: Number, default: 0 },
  skillsMatched: [String]     // skills matched with job
});

module.exports = mongoose.model("Candidate", candidateSchema);