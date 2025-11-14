/*// server/server.js
import dotenv from "dotenv";
dotenv.config(); // Must be first

import express from "express";
import cors from "cors";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Quick check to confirm key loaded from .env
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY not found. Check your .env file and restart the server.");
} else {
  console.log("✅ OPENAI_API_KEY loaded successfully");
}

app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));*/

// server/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

// ✅ Allow all origins for testing
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(express.json());

// Log every request (for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api/ai", aiRoutes);

// Fallback route for browser GET /
app.get("/", (req, res) => {
  res.send("✅ AI PDF Summarizer backend is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

