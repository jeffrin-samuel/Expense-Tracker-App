require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const transactionRoutes = require("./routes/transactions");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [
      "http://localhost:3000",                              // local dev
      "https://jeffrin-samuel.github.io",                  // GitHub Pages
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Expense Tracker API is running 🚀",
    version: "1.0.0",
    endpoints: {
      transactions: "/api/transactions",
      stats:        "/api/transactions/stats/summary",
    },
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/transactions", transactionRoutes);

// ─── 404 & Error Handlers ─────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API base: http://localhost:${PORT}/api`);
});