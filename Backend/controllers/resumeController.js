const Resume = require("../models/Candidates");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const fs = require("fs");

// Upload Resume
exports.uploadResume = async (req, res) => {
  try {
    const { name, email } = req.body;

    let text = "";

    if (req.file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(req.file.path);
      const data = await pdfParse(dataBuffer);
      text = data.text;
    } else {
      const result = await mammoth.extractRawText({ path: req.file.path });
      text = result.value;
    }

    const resume = new Resume({
      name,
      email,
      filePath: req.file.path,
      extractedText: text,
      atsScore: 0
    });

    await resume.save();

    res.json({ message: "Resume uploaded successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.analyzeResumes = async (req, res) => {
  const { jobDescription } = req.body;

  const resumes = await Resume.find();

  const ranked = resumes.map(resume => {
    let score = 0;

    const jd = jobDescription.toLowerCase();
    const resumeText = resume.extractedText.toLowerCase();

    const skills = ["javascript", "react", "node", "mongodb", "html", "css"];

    skills.forEach(skill => {
      if (jd.includes(skill) && resumeText.includes(skill)) {
        score += 15;
      }
    });

    if (resumeText.match(/\d+\s+years?/)) {
      score += 20;
    }

    return {
      ...resume._doc,
      atsScore: score
    };
  });

  ranked.sort((a, b) => b.atsScore - a.atsScore);

  res.json(ranked);
};