const express = require("express");
const router = express.Router();
const db = require("../config/db"); // your database connection

// ADMIN LOGIN
router.post("/admin-login", (req, res) => {

  const { email, password } = req.body;

  const sql = "SELECT * FROM admin WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, result) => {

    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length > 0) {
      res.json({
        success: true,
        admin: result[0]
      });
    } else {
      res.json({
        success: false,
        message: "Invalid email or password"
      });
    }

  });

});

module.exports = router;
