require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const patternRoutes = require("./routes/patternRoutes");
const mockRoutes = require("./routes/mockRoutes");
const evaluateRoutes = require("./routes/evaluateRoutes");

const app = express();

const PORT = Number(process.env.PORT) || 5001;

const CLIENT_URL =
  process.env.CLIENT_URL || "http://localhost:3001";

// ===============================
// CORS
// ===============================

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ===============================
// BODY PARSER
// ===============================

app.use(express.json({ limit: "2mb" }));


// ===============================
// ROOT
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "AlgoFlow API is running",
  });
});

// ===============================
// HEALTH CHECK
// ===============================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    ok: true,
    service: "algoflow-api",
  });
});

// ===============================
// API ROUTES
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/problems", problemRoutes);

app.use("/api/patterns", patternRoutes);

app.use("/api/mock-sessions", mockRoutes);

app.use("/api/evaluate", evaluateRoutes);

// ===============================
// 404
// ===============================

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ===============================
// GLOBAL ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  const statusCode =
    Number(err.statusCode) ||
    Number(err.status) ||
    500;

  res.status(statusCode).json({
    message: err.message || "Internal server error",
  });
});

// ===============================
// START SERVER
// ===============================

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("");
      console.log("====================================");
      console.log("       AlgoFlow API Started");
      console.log("====================================");
      console.log(`Backend:  http://localhost:${PORT}`);
      console.log(`Frontend: ${CLIENT_URL}`);
      console.log("====================================");
      console.log("");
    });
  } catch (error) {
    console.error("Failed to start AlgoFlow API:");
    console.error(error);

    process.exit(1);
  }
};

startServer();