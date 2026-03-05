const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ---------------- Upload Config ----------------

const uploadPath = "./uploads";

// create uploads folder if not exist
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

// file filter (only resume types)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [".pdf", ".docx", ".txt"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOCX, TXT files allowed"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// ---------------- Apply Job ----------------

router.post("/", upload.single("resume"), (req, res) => {

  const { name, email, experience, jobId } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Resume file required" });
  }

  const resumeFile = req.file.filename;

  const sql =
    "INSERT INTO candidates (name,email,experience,resume,jobId) VALUES (?,?,?,?,?)";

  db.query(
    sql,
    [name, email, experience, resumeFile, jobId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }

      res.json({
        message: "Application submitted successfully",
        candidateId: result.insertId
      });
    }
  );
});

// ---------------- Get All Candidates ----------------

router.get("/", (req, res) => {

  const sql = "SELECT * FROM candidates";

  db.query(sql, (err, candidates) => {

    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    res.json(candidates);
  });

});

// ---------------- Delete Candidate ----------------

router.delete("/:id", (req, res) => {

  const candidateId = req.params.id;

  const sql = "DELETE FROM candidates WHERE id=?";

  db.query(sql, [candidateId], (err) => {

    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    res.json({ message: "Candidate deleted successfully" });

  });

});

module.exports = router;