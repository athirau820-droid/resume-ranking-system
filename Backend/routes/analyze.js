const express = require("express");
const router = express.Router();
const db = require("../config/db");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

// ---------------------
// Extract Resume Text
// ---------------------
const extractResumeText = async (filePath) => {

  try {

    if (!fs.existsSync(filePath)) {
      console.log("File not found:", filePath);
      return "";
    }

    const ext = path.extname(filePath).toLowerCase();

    // TXT
    if (ext === ".txt") {
      return fs.readFileSync(filePath, "utf8");
    }

    // PDF
    if (ext === ".pdf") {

  const buffer = fs.readFileSync(filePath);

  const data = await pdfParse(buffer);

  return data.text;

}

    // DOCX
    if (ext === ".docx") {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    }

  } catch (error) {
    console.log("Resume parse error:", error);
  }

  return "";
};


// ---------------------
// ATS Analyze Route
// ---------------------
router.get("/:jobId", async (req, res) => {

  const jobId = req.params.jobId;

  try {

    // ---------------------
    // Get Job Details
    // ---------------------
    const [jobs] = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM jobs WHERE id = ?", [jobId], (err, result) => {
        if (err) reject(err);
        else resolve([result]);
      });
    });

    if (jobs.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    const job = jobs[0];

    const jobSkills = job.skills
      ? job.skills.split(",").map(s => s.trim().toLowerCase())
      : [];


    // ---------------------
    // Get Candidates
    // ---------------------
    const [candidates] = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM candidates WHERE jobId = ?", [jobId], (err, result) => {
        if (err) reject(err);
        else resolve([result]);
      });
    });

    const rankedCandidates = [];

    for (let candidate of candidates) {

      let score = 0;
      let skillsMatched = [];

      const filePath = path.join(__dirname, "../uploads", candidate.resume);

      const resumeText = (await extractResumeText(filePath)).toLowerCase();

      // ---------------------
      // Skill Matching
      // ---------------------
      jobSkills.forEach(skill => {

        if (resumeText.includes(skill)) {

          score += 10;
          skillsMatched.push(skill);

        }

      });

      // ---------------------
      // Experience Matching
      // ---------------------
      if (Number(candidate.experience) >= job.experience_required) {
        score += 20;
      }

      // ---------------------
      // ATS Calculation
      // ---------------------
      const maxScore = (jobSkills.length * 10) + 20;

      const atsScorePercent = maxScore
        ? Math.round((score / maxScore) * 100)
        : 0;

      // ---------------------
      // Update Database
      // ---------------------
      await new Promise((resolve) => {

        db.query(
          "UPDATE candidates SET atsScore=?, skillsMatched=? WHERE id=?",
          [
            atsScorePercent,
            skillsMatched.length ? skillsMatched.join(",") : "None",
            candidate.id
          ],
          () => resolve()
        );

      });

      rankedCandidates.push({
        ...candidate,
        atsScore: atsScorePercent,
        skillsMatched
      });

    }

    // ---------------------
    // Sort by ATS Score
    // ---------------------
    rankedCandidates.sort((a, b) => b.atsScore - a.atsScore);

    res.json(rankedCandidates);

  } catch (error) {

    console.log("Analyze error:", error);
    res.status(500).json({ message: "Server error" });

  }

});

module.exports = router;