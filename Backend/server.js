const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors()); // MUST be before routes
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Import routes
const candidateRoute = require("./routes/candidates");
const analyzeRoute = require("./routes/analyze");
const jobRoute = require("./routes/jobs");
const loginRoutes = require("./routes/login");

// Resume upload folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", loginRoutes);
app.use("/api/candidates", candidateRoute);
app.use("/api/analyze", analyzeRoute);
app.use("/api/jobs", jobRoute);

// Default route
app.get("/", (req, res) => {
  res.send("Smart Talent Engine API Running...");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server Error" });
});

// Start server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
